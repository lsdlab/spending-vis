const express = require('express')
const router = express.Router()
const fs = require('fs')
const marked = require('marked')

const db = require('./db')


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index')
})

/* GET about page. */
router.get('/about', function(req, res) {
  var path = __dirname.slice(0, -7) + '/views/markdown/about.md'
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      console.log(err)
    }
    var markdownContent = marked(data)
    res.render('about', { markdownContent: markdownContent })
  })
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
  req.assert('cpi_text', '必须选择分类').notEmpty()
  req.assert('time', '必须选择时间').notEmpty()
  req.assert('amount', '必须输入金额').notEmpty()
  req.assert('amount', '金额必须为数字').isInt()
  req.assert('note', '必须输入备注').notEmpty()

  var errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/new')
  }

  // TODO
  var cpi_index_and_text = req.body.cpi_text.split(':')
  var cpi_index = cpi_index_and_text[0].trim()
  var cpi_text = cpi_index_and_text[1].trim()
  var time = req.body.time
  var amount = req.body.amount
  var note = req.body.note
  db.one('INSERT INTO entry(cpi_index, cpi_text, date, amount, note) values($1, $2, $3, $4, $5) returning id',
    [cpi_index, cpi_text, time, amount, note ])
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



/* GET brief page. */
router.get('/brief', function(req, res) {
  res.render('brief')
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

/* GET charts category page using ECharts. */
router.get('/charts-category-echarts', function(req, res) {
  res.render('charts-category-echarts')
})


module.exports = router
