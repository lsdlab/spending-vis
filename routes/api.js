var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var _ = require('underscore');
var Q = require('q');

require('../util/fourcalculation');

var url = 'mongodb://localhost:27017/spending-vis';
var entry;
getEntry(url).then(function(data) {
    entry = data;
}).catch(function() {
    entry = {
        'message': 1
    };
});


/* GET all data for table page. */
router.get('/alldata', function(req, res) {
    if (entry['message'] !== 1) {
        entry.find({}).toArray(function(err, doc) {
            if (doc != null) {
                res.json({
                    message: 0,
                    data: doc
                });
            } else {
                res.json({
                    message: 1,
                });
            }
        });
    } else {
        res.json({
            message: 1,
        });
    }
});


/* GET year amount data for charts-year. */
router.get('/years', function(req, res) {
    if (entry['message'] !== 1) {
        entry.find({}).toArray(function(err, doc) {
            if (doc != null) {
                var yearData = _.reduce(doc, function(years, item) {
                    if (years[item.year + ' 年']) {
                        years[item.year + ' 年'] = years[item.year + ' 年'].add(item.amount)
                    } else {
                        years[item.year + ' 年'] = item.amount
                    }
                    return years
                }, {});
                res.json({
                    message: 0,
                    data: yearData
                });
            } else {
                res.json({
                    message: 1,
                });
            }
        });
    } else {
        res.json({
            message: 0,
        });
    }
});


/* GET all month amount data by year for charts-year */
router.get('/allmonth', function(req, res) {
    if (entry['message'] !== 1) {
        entry.find({}).toArray(function(err, doc) {
            if (doc != null) {
                var allmonthData = _.reduce(doc, function(allmonths, item) {
                    if (allmonths[item.year + '-' + item.month]) {
                        allmonths[item.year + '-' + item.month] = allmonths[item.year + '-' + item.month].add(item.amount)
                    } else {
                        allmonths[item.year + '-' + item.month] = item.amount
                    }
                    return allmonths
                }, {});
                res.json({
                    message: 0,
                    data: allmonthData
                });
            } else {
                res.json({
                    message: 1,
                });
            }
        });
    } else {
        res.json({
            message: 0,
        });
    }
})

/* GET month amount data by year for charts-month */
router.get('/bymonth/:year(\\d{4})', function(req, res) {
    if (entry['message'] !== 1) {
        entry.find({
            'year': req.params.year
        }).toArray(function(err, doc) {
            if (doc != null) {
                var monthData = _.reduce(doc, function(months, item) {
                    if (months[item.month + ' 月']) {
                        months[item.month + ' 月'] = months[item.month + ' 月'].add(item.amount)
                    } else {
                        months[item.month + ' 月'] = item.amount
                    }
                    return months
                }, {});
                res.json({
                    message: 0,
                    data: monthData
                });
            } else {
                res.json({
                    message: 1,
                });
            }
        });
    } else {
        res.json({
            message: 0,
        });
    }
});


function getEntry(url) {
    var getEntryDefer = Q.defer();

    MongoClient.connect(url, function(err, db) {
        if (!err) {
            var entry = db.collection('entry');
            getEntryDefer.resolve(entry);
        } else {
            getEntryDefer.reject();
        }
    });

    return getEntryDefer.promise;
}


module.exports = router;
