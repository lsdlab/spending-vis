const express = require('express')
const router = express.Router()
const fs = require('fs')
const marked = require('marked')


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index')
})

/* GET about page. */
router.get('/about', function(req, res) {
  var path = __dirname.slice(0, -7) + '/views/markdown/about.md'
  fs.readFile(path, 'utf8', function(err, data) {
    if(err) {
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

/* GET table page. */
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
