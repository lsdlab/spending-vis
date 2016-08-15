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

var category = {
    '0': '食品',
    '1': '食品',
    '2': '穿',
    '4': '食品',
    '6': '居住',
    '10': '交通通信',
    '13': '食品',
    '17': '教育',
    '18': '教育',
    '19': '文化娱乐',
    '28': '教育',
    '30': '交通通信',
    '31': '穿',
    '33': '居住',
    '34': '居住',
    '39': '教育',
    '40': '食品',
    '43': '穿',
    '44': '居住',
    '48': '食品',
    '57': '穿',
    '62': '文化娱乐',
    '67': '文化娱乐',
    '80': '文化娱乐',
    '81': '教育',
    '87': '交通通信'
}

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
router.get('/monthdatabyyear/:year(\\d{4})', function(req, res) {
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

/* GET all category amount data by year */
router.get('/categorydatabyyear/:year(\\d{4})', function(req, res) {
    if (entry['message'] !== 1) {
        entry.find({
            'year': req.params.year
        }).toArray(function(err, doc) {
            if (doc != null) {
                var reducedData = _.reduce(doc, function(months, item) {
                    if (months[item.categoryid]) {
                        months[item.categoryid] = months[item.categoryid].add(item.amount)
                    } else {
                        months[item.categoryid] = item.amount
                    }
                    return months
                }, {});

                var totalAmount = _.reduce(reducedData, function(memo, value){
                    return memo.add(value);
                }, 0);
                var monthData = {}
                _.each(reducedData, function(value, key){
                    newKey = category[key]
                    if (monthData[newKey]) {
                        monthData[newKey] = monthData[newKey].add(value)
                    } else {
                        monthData[newKey] = value
                    }
                });
                _.each(monthData, function(value, key){
                    monthData[key] = value.div(totalAmount).mul(100).toFixed(2)
                });
                res.json({
                    message: 0,
                    data: {
                        title: req.params.year.toString() + ' 年支出（百分比）',
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
