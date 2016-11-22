const express = require('express')
const router = express.Router()
const passport = require('passport')
const _ = require('underscore')
const shortid = require('shortid')

const User = require('../models/user')
const passportConfig = require('../passport/passport')
const db = require('./db')


/**
 * GET /signup
 * Signup page.
 */
router.get('/signup', function(req, res) {
  if (req.user) {
    req.flash('success', { msg: '注册成功' })
    return res.redirect('/')
  }
  res.render('user/signup')
})


/**
 * POST /signup
 * Create a new local account.
 */
router.post('/signup', function(req, res, next) {
  req.assert('email', '请输入正确的邮箱❌').isEmail()
  req.assert('password', '密码必须八位字符以上❌').len(8)
  req.assert('confirmPassword', '两次密码输入不一致❌').equals(req.body.password)

  var errors = req.validationErrors()
  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/signup')
  }

  var email = req.body.email
  var password = req.body.password
  var accountStatus = 'verifying'
  var quickLoginToken = shortid.generate()
  var createdAt = new Date()
  var updatedAt = new Date()

  User.findUserByEmail(email).then(function(existingUser) {
    if (!_.isEmpty(existingUser)) {
      req.flash('errors', { msg: '此邮箱已经存在，请直接登录' })
      return res.redirect('/login')
    } else {
      User.generateHashedPassword(password).then(function(hashedPassowrd) {
        db.none('insert into users(email, password, account_status, quick_login_token, created_at, updated_at) values($1, $2, $3, $4, $5, $6)', [email, hashedPassowrd, accountStatus, quickLoginToken, createdAt, updatedAt])
          .then(function(data) {
            return res.redirect('/quicklogin/' + quickLoginToken)
          })
          .catch(function(error) {
            return next(error)
          })
      })
    }
  })
  .catch(function(error) {
    return next(error)
  })
})


/**
 * GET /verifying
 * Verifying page.
 */
router.get('/verifying', function(req, res) {
  var passedVariable = req.query.valid
  if (passedVariable == 'verifying') {
    res.render('user/verifying')
  } else {
    return res.redirect('/signup')
  }
})

/**
 * GET /quicklogin
 * Quick login page.
 */
router.get('/quicklogin/:quicklogintoken', function(req, res, next) {
  User.findUserByQuickLoginToken(req.params.quicklogintoken).then(function(existingUser) {
    if (existingUser) {
      req.logIn(existingUser, function(err) {
        if (err) {
          return next(err)
        }
        return res.redirect('/signup')
      })
    } else {
      req.flash('errors', { msg: 'DATABASE ERROR❌' })
      return res.redirect('/signup')
    }
  })
  .catch(function(error) {
    return next(error)
  })
})


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
