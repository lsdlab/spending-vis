const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user')
const passportConfig = require('../passport/passport')

/**
 * GET /login
 * Login page.
 */
router.get('/login', function(req, res) {
  if (req.user) {
    return res.redirect(req.session.returnTo || '/')
  }
  res.render('user/login')
})


/**
 * POST /login
 * Sign in using email and password.
 */
router.post('/login', function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail()
  req.assert('password', 'Password cannot be blank').notEmpty()

  var errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/login')
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      req.flash('errors', { msg: info.msg })
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err)
      }
      req.flash('success', { msg: '登录成功' })
      return res.redirect('/')
    })
  })(req, res, next)
})


/**
 * GET /logout
 * Log out.
 */
router.get('/logout', function(req, res) {
  req.logout()
  req.flash('success', { msg: '退出成功' })
  return res.redirect('/')
})


/**
 * GET /account
 * Profile page.
 */
router.get('/account', passportConfig.isAuthenticated, function(req, res) {
  if (!req.user) {
    return res.redirect('/login')
  }
  res.render('user/profile', { title: 'profile' })
})

/**
 * POST /account/profile
 * Update profile information.
 */
router.post('/account/profile', passportConfig.isAuthenticated, function(req, res, next) {
  var email = req.body.email || ''
  var name = req.body.name || ''
  var bio = req.body.bio || ''
  var url = req.body.url || ''
  var location = req.body.location || ''

  var updateProfilePromise = User.updateProfile(email, name, bio, url, location, req.user.id)
  updateProfilePromise.then(function() {
    req.flash('success', { msg: '个人信息已更新' })
    return res.redirect('/account')
  })
  .catch(function(error) {
    return next(error)
  })
})

module.exports = router
