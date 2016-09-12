const express = require('express')
const router = express.Router()


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index')
})

/* GET about page. */
router.get('/about', function(req, res) {
    res.render('about')
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
router.get('/charts-category', function(req, res) {
    res.render('charts-category')
})

/* GET charts category page. */
router.get('/charts-category-quarter', function(req, res) {
    res.render('charts-category-quarter')
})


/* GET charts category page using ECharts. */
router.get('/charts-category-echarts', function(req, res) {
    res.render('charts-category-echarts')
})

/* GET 404 page. */
router.get('/404', function(req, res) {
    res.render('404')
})


module.exports = router
