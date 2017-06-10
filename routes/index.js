const express = require('express')
const router = express.Router()
const fs = require('fs')
const marked = require('marked')

const db = require('./db')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index')
})

/* GET 404 page. */
router.get('/404', function(req, res) {
  res.render('404')
})

/* GET working on page. */
router.get('/working-on', function(req, res) {
  res.render('working')
})


/* GET new page. */
router.get('/new', function(req, res) {
  res.render('new')
})


/* POST new page. */
router.post('/new', function(req, res) {
  req.assert('cpi', '必须选择分类').notEmpty()
  req.assert('time', '必须选择时间').notEmpty()
  req.assert('amount', '必须输入金额').notEmpty()
  req.assert('amount', '金额必须为数字').isFloat()
  req.assert('note', '必须输入备注').notEmpty()

  var error = req.validationErrors()[0]

  var cpi_index_and_text = req.body.cpi.split(':')
  var cpi_index = cpi_index_and_text[0].trim()
  var cpi_text = cpi_index_and_text[1].trim()
  var time = req.body.time
  var amount = req.body.amount
  var note = req.body.note

  if (error) {
    req.flash('errors', error)
    res.render('new', {
      cpi: cpi_index + ': ' + cpi_text,
      time: time,
      amount: amount,
      note: note
    })
  }

  db.one('INSERT INTO entry(cpi_index, cpi_text, date, amount, note) values($1, $2, $3, $4, $5) returning id', [cpi_index, cpi_text, time, amount, note])
    .then(function(data) {
      req.flash('success', { msg: '保存成功' })
      return res.redirect('/new')
    })
    .catch(function(error) {
      console.log(error)
      req.flash('errors', { msg: '保存出错！' })
      return res.redirect('/new')
    })

})


/* GET last-month-brief page. */
router.get('/last-month-brief', function(req, res) {
  res.render('last-month-brief')
})

/* GET this-month-brief page. */
router.get('/this-month-brief', function(req, res) {
  res.render('this-month-brief')
})

/* GET table page. */
router.get('/tables', function(req, res) {
  res.render('tables')
})

/* GET charts year page. */
router.get('/charts-year', function(req, res) {
  res.render('charts-year')
})

/* GET charts month page. */
router.get('/charts-month', function(req, res) {
  res.render('charts-month')
})

/* GET charts category page. */
router.get('/charts-category-year', function(req, res) {
  res.render('charts-category-year')
})

/* GET charts category page. */
router.get('/charts-category-quarter', function(req, res) {
  res.render('charts-category-quarter')
})

/* GET charts keyword cloud page */
router.get('/keyword-wordcloud', function(req, res) {
  res.render('keyword-wordcloud')
})


module.exports = router
