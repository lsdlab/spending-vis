var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;


var _ = require('underscore');
var Q = require('q');

require('../util/fourcalculation');

var url = 'mongodb://localhost:27017/spending-vis-backend';
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
                var yearData = {
                    '2014 年': 0,
                    '2015 年': 0,
                    '2016 年': 0
                };
                _.each(doc, function(item) {
                    if (item.year === '2014') {
                        yearData['2014 年'] = yearData['2014 年'].add(item.amount);
                    } else if (item.year === '2015') {
                        yearData['2015 年'] = yearData['2015 年'].add(item.amount);
                    } else if (item.year === '2016') {
                        yearData['2016 年'] = yearData['2016 年'].add(item.amount);
                    }
                });
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
                var allmonthData = {
                    '2014-6': 0,
                    '2014-7': 0,
                    '2014-8': 0,
                    '2014-9': 0,
                    '2014-10': 0,
                    '2014-11': 0,
                    '2014-12': 0,
                    '2015-1': 0,
                    '2015-2': 0,
                    '2015-3': 0,
                    '2015-4': 0,
                    '2015-5': 0,
                    '2015-6': 0,
                    '2015-7': 0,
                    '2015-8': 0,
                    '2015-9': 0,
                    '2015-10': 0,
                    '2015-11': 0,
                    '2015-12': 0,
                    '2016-1': 0,
                    '2016-2': 0,
                    '2016-3': 0,
                    '2016-4': 0,
                    '2016-5': 0,
                    '2016-6': 0
                }
                _.each(doc, function(item){
                    if (item.year === '2014') {
                        if (item.month === '6') {
                            allmonthData['2014-6'] = allmonthData['2014-6'].add(item.amount)
                        } else if (item.month === '7') {
                            allmonthData['2014-7'] = allmonthData['2014-7'].add(item.amount)
                        } else if (item.month === '8') {
                            allmonthData['2014-8'] = allmonthData['2014-8'].add(item.amount)
                        } else if (item.month === '9') {
                            allmonthData['2014-9'] = allmonthData['2014-9'].add(item.amount)
                        } else if (item.month === '10') {
                            allmonthData['2014-10'] = allmonthData['2014-10'].add(item.amount)
                        } else if (item.month === '11') {
                            allmonthData['2014-11'] = allmonthData['2014-11'].add(item.amount)
                        } else if (item.month === '12') {
                            allmonthData['2014-12'] = allmonthData['2014-12'].add(item.amount)
                        }
                    } else if (item.year === '2015') {
                        if (item.month === '1') {
                            allmonthData['2015-1'] = allmonthData['2015-1'].add(item.amount)
                        } else if (item.month === '2') {
                            allmonthData['2015-2'] = allmonthData['2015-2'].add(item.amount)
                        } else if (item.month === '3') {
                            allmonthData['2015-3'] = allmonthData['2015-3'].add(item.amount)
                        } else if (item.month === '4') {
                            allmonthData['2015-4'] = allmonthData['2015-4'].add(item.amount)
                        } else if (item.month === '5') {
                            allmonthData['2015-5'] = allmonthData['2015-5'].add(item.amount)
                        } else if (item.month === '6') {
                            allmonthData['2015-6'] = allmonthData['2015-6'].add(item.amount)
                        } else if (item.month === '7') {
                            allmonthData['2015-7'] = allmonthData['2015-7'].add(item.amount)
                        } else if (item.month === '8') {
                            allmonthData['2015-8'] = allmonthData['2015-8'].add(item.amount)
                        } else if (item.month === '9') {
                            allmonthData['2015-9'] = allmonthData['2015-9'].add(item.amount)
                        } else if (item.month === '10') {
                            allmonthData['2015-10'] = allmonthData['2015-10'].add(item.amount)
                        } else if (item.month === '11') {
                            allmonthData['2015-11'] = allmonthData['2015-11'].add(item.amount)
                        } else if (item.month === '12') {
                            allmonthData['2015-12'] = allmonthData['2015-12'].add(item.amount)
                        }
                    } else if (item.year === '2016') {
                        if (item.month === '1') {
                            allmonthData['2016-1'] = allmonthData['2016-1'].add(item.amount)
                        } else if (item.month === '2') {
                            allmonthData['2016-2'] = allmonthData['2016-2'].add(item.amount)
                        } else if (item.month === '3') {
                            allmonthData['2016-3'] = allmonthData['2016-3'].add(item.amount)
                        } else if (item.month === '4') {
                            allmonthData['2016-4'] = allmonthData['2016-4'].add(item.amount)
                        } else if (item.month === '5') {
                            allmonthData['2016-5'] = allmonthData['2016-5'].add(item.amount)
                        } else if (item.month === '6') {
                            allmonthData['2016-6'] = allmonthData['2016-6'].add(item.amount)
                        }
                    }

                });
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
                var monthData = {
                    '1 月': 0,
                    '2 月': 0,
                    '3 月': 0,
                    '4 月': 0,
                    '5 月': 0,
                    '6 月': 0,
                    '7 月': 0,
                    '8 月': 0,
                    '9 月': 0,
                    '10 月': 0,
                    '11 月': 0,
                    '12 月': 0
                }
                _.each(doc, function(item) {
                    if (item.month === '1') {
                        monthData['1 月'] = monthData['1 月'].add(item.amount)
                    } else if (item.month === '2') {
                        monthData['2 月'] = monthData['2 月'].add(item.amount)
                    } else if (item.month === '3') {
                        monthData['3 月'] = monthData['3 月'].add(item.amount)
                    } else if (item.month === '4') {
                        monthData['4 月'] = monthData['4 月'].add(item.amount)
                    } else if (item.month === '5') {
                        monthData['5 月'] = monthData['5 月'].add(item.amount)
                    } else if (item.month === '6') {
                        monthData['6 月'] = monthData['6 月'].add(item.amount)
                    } else if (item.month === '7') {
                        monthData['7 月'] = monthData['7 月'].add(item.amount)
                    } else if (item.month === '8') {
                        monthData['8 月'] = monthData['8 月'].add(item.amount)
                    } else if (item.month === '9') {
                        monthData['9 月'] = monthData['9 月'].add(item.amount)
                    } else if (item.month === '10') {
                        monthData['10 月'] = monthData['10 月'].add(item.amount)
                    } else if (item.month === '11') {
                        monthData['11 月'] = monthData['11 月'].add(item.amount)
                    } else if (item.month === '12') {
                        monthData['12 月'] = monthData['12 月'].add(item.amount)
                    }
                });

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
