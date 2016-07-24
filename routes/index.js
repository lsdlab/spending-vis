var express = require('express');
var router = express.Router();

var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET home page. */
router.get('/tables', function(req, res, next) {


    res.render('tables');
});

/* GET 404 page. */
router.get('/404', function(req, res, next) {
    res.render('404');
});



module.exports = router;
