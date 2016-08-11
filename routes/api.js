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
                var reducedData = _.reduce(doc, function(years, item) {
                    if (years[item.year]) {
                        years[item.year] = years[item.year].add(item.amount)
                    } else {
                        years[item.year] = item.amount
                    }
                    return years
                }, {});
                var yearData = {}
                _.each(reducedData, function(value, key){
                    key += ' 年'
                    yearData[key] = value
                });
                res.json({
                    message: 0,
                    data: {
                        title: '2014 ~ 2016 年支出（元/年）',
                        data: yearData
                    }
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
                    dataKey = item.year + '-' + item.month
                    if (allmonths[dataKey]) {
                        allmonths[dataKey] = allmonths[dataKey].add(item.amount)
                    } else {
                        allmonths[dataKey] = item.amount
                    }
                    return allmonths
                }, {});
                res.json({
                    message: 0,
                    data: {
                        title: '2014 ~ 2016 年支出（元/月）',
                        data: allmonthData
                    }
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
                var reducedData = _.reduce(doc, function(months, item) {
                    if (months[item.month]) {
                        months[item.month] = months[item.month].add(item.amount)
                    } else {
                        months[item.month] = item.amount
                    }
                    return months
                }, {});
                var monthData = {}
                _.each(reducedData, function(value, key){
                    key += ' 月'
                    monthData[key] = value
                });
                res.json({
                    message: 0,
                    data: {
                        title: req.params.year.toString() + ' 年支出（元/月）',
                        data: monthData
                    }
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
