var express = require('express');
var router = express.Router();

var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET table page. */
router.get('/tables', function(req, res, next) {
    res.render('tables');
});

/* GET charts year page. */
router.get('/charts-year', function(req, res, next) {
    res.render('charts-year');
});

/* GET charts month page. */
router.get('/charts-month', function(req, res, next) {
    res.render('charts-month');
});

/* GET charts category page. */
router.get('/charts-category', function(req, res, next) {
    res.render('charts-category');
});

/* GET 404 page. */
router.get('/404', function(req, res, next) {
    res.render('404');
});



module.exports = router;
