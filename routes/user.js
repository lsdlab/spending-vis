const express = require('express')
const router = express.Router()

const User = require('../models/user')
const passport = require('passport')

/**
 * GET /signup
 * Signup page.
 */
router.get('/signup', function (req, res) {
  if (req.user) {
    req.flash('success', { msg: '登录成功' })
    return res.redirect('/')
  }
  res.render('user/signup', {
    title: 'signup'
  })
})

/**
 * POST /signup
 * Create a new local account.
 */
router.post('/signup', function (req, res, next) {
  req.assert('email', '邮箱格式无效').isEmail()
  req.assert('password', '密码最少 8 个字符').len(8)
  req.assert('confirmPassword', '两次输入密码不一致').equals(req.body.password)

  var errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/signup')
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password
  })

  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: '此邮箱已经注册，请直接登录' })
      return res.redirect('/signup')
    }
    user.save(function (err) {
      if (err) {
        return next(err)
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err)
        }
        res.redirect('/')
      })
    })
  })
})

/**
 * GET /login
 * Login page.
 */
router.get('/login', function (req, res) {
  if (req.user) {
    return res.redirect('/')
  }
  res.render('user/login', {
    title: 'login'
  })
})

/**
 * POST /login
 * Sign in using email and password.
 */
router.post('/login', function (req, res, next) {
  req.assert('email', '邮箱格式无效').isEmail()
  req.assert('password', '密码不能为空').notEmpty()

  var errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/login')
  }

  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      req.flash('errors', { msg: info.message })
      return res.redirect('/login')
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }
      req.flash('success', { msg: '登录成功' })
      res.redirect(req.session.returnTo || '/')
    })
  })(req, res, next)
})

/**
 * GET /logout
 * Log out.
 */
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

/**
 * GET /account
 * Profile page.
 */
router.get('/account', function (req, res) {
  if (!req.user) {
    return res.redirect('/login')
  }
  res.render('user/profile')
})

/**
 * POST /account/profile
 * Update profile information.
 */
router.post('/account/profile', function (req, res, next) {
  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err)
    }
    user.email = req.body.email || ''
    user.profile.name = req.body.name || ''
    user.profile.bio = req.body.bio || ''
    user.profile.url = req.body.url || ''
    user.profile.location = req.body.location || ''
    user.save(function (err) {
      if (err) {
        return next(err)
      }
      req.flash('success', { msg: '个人资料更新成功' })
      res.redirect('/account')
    })
  })
})

/**
 * POST /account/password
 * Update current password.
 */
router.post('/account/password', function (req, res, next) {
  req.assert('password', '密码最少 8 个字符').len(8)
  req.assert('confirmPassword', '两次输入密码不一致').equals(req.body.password)

  var errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/account')
  }

  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err)
    }
    user.password = req.body.password
    user.save(function (err) {
      if (err) {
        return next(err)
      }
      req.flash('success', { msg: '密码修改成功' })
      res.redirect('/account')
    })
  })
})

/**
 * POST /account/delete
 * Delete user account.
 */
router.post('/account/delete', function (req, res, next) {
  User.remove({ _id: req.user.id }, function (err) {
    if (err) {
      return next(err)
    }
    req.logout()
    req.flash('info', { msg: '帐号已删除' })
    res.redirect('/')
  })
})

module.exports = router
