const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
const chalk = require('chalk');
const MongoClient = require('mongodb').MongoClient
const _ = require('underscore')
const Q = require('q')

const util = require('../utils/util')

dotenv.load({
    path: '.env.development'
})

// GET MongoDB collection [entry]
const url = process.env.MONGODB_URI
var entry
getEntry(url).then(function(data) {
    entry = data
}).catch(function() {
    entry = {
        'message': 1
    }
})

// category summary util
const category = util.category()

/* GET all data for table page. */
router.get('/alldata', function(req, res) {
    if (entry['message'] !== 1) {
        entry.find({}).toArray(function(err, doc) {
            if (doc != null) {
                res.json({
                    message: 0,
                    data: doc
                })
            } else {
                res.json({
                    message: 1,
                })
            }
        })
    } else {
        res.json({
            message: 1,
        })
    }
})


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
                }, {})
                var yearData = {}
                _.each(reducedData, function(value, key) {
                    key += ' 年'
                    yearData[key] = value
                })
                res.json({
                    message: 0,
                    data: {
                        title: '2014 ~ 2016 年支出（元/年）',
                        data: yearData
                    }
                })
            } else {
                res.json({
                    message: 1,
                })
            }
        })
    } else {
        res.json({
            message: 0,
        })
    }
})


/* GET all month amount data by year for charts-year */
router.get('/allmonth', function(req, res) {
    if (entry['message'] !== 1) {
        entry.find({}).toArray(function(err, doc) {
            if (doc != null) {
                var allmonthData = _.reduce(doc, function(allmonths, item) {
                    var dataKey
                    dataKey = item.year + '-' + item.month
                    if (allmonths[dataKey]) {
                        allmonths[dataKey] = allmonths[dataKey].add(item.amount)
                    } else {
                        allmonths[dataKey] = item.amount
                    }
                    return allmonths
                }, {})
                res.json({
                    message: 0,
                    data: {
                        title: '2014 ~ 2016 年支出（元/月）',
                        data: allmonthData
                    }
                })
            } else {
                res.json({
                    message: 1,
                })
            }
        })
    } else {
        res.json({
            message: 0,
        })
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
                }, {})
                var monthData = {}
                _.each(reducedData, function(value, key) {
                    key += ' 月'
                    monthData[key] = value
                })
                res.json({
                    message: 0,
                    data: {
                        title: req.params.year.toString() + ' 年支出（元/月）',
                        data: monthData
                    }
                })
            } else {
                res.json({
                    message: 1,
                })
            }
        })
    } else {
        res.json({
            message: 0,
        })
    }
})

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
                }, {})

                var totalAmount = _.reduce(reducedData, function(memo, value) {
                    return memo.add(value)
                }, 0)
                var categoryData = {}
                _.each(reducedData, function(value, key) {
                    var newKey
                    newKey = category[key]
                    if (categoryData[newKey]) {
                        categoryData[newKey] = categoryData[newKey].add(value)
                    } else {
                        categoryData[newKey] = value
                    }
                })
                _.each(categoryData, function(value, key) {
                    categoryData[key] = value.div(totalAmount).mul(100).toFixed(2)
                })
                res.json({
                    message: 0,
                    data: {
                        title: req.params.year.toString() + ' 年支出 (百分比)',
                        data: categoryData
                    }
                })
            } else {
                res.json({
                    message: 1,
                })
            }
        })
    } else {
        res.json({
            message: 0,
        })
    }
})

/* GET all category amount data by year */
router.get('/categorydatabyquarter/:year(\\d{4})', function(req, res) {
    if (entry['message'] !== 1) {
        entry.find({
            'year': req.params.year
        }).toArray(function(err, doc) {
            if (doc != null) {
                var quarterData = {}
                quarterData['1'] = []
                quarterData['2'] = []
                quarterData['3'] = []
                quarterData['4'] = []
                _.each(doc, function(item) {
                    if (item.month === '1' || item.month === '2' || item.month === '3') {
                        quarterData['1'].push(item)
                    } else if (item.month === '4' || item.month === '5' || item.month === '5') {
                        quarterData['2'].push(item)
                    } else if (item.month === '7' || item.month === '8' || item.month === '9') {
                        quarterData['3'].push(item)
                    } else if (item.month === '10' || item.month === '11' || item.month === '12') {
                        quarterData['4'].push(item)
                    }
                })

                var reducedList = []
                _.each(quarterData, function(quarterItem){
                    var reducedData = _.reduce(quarterItem, function(months, item) {
                        if (months[item.categoryid]) {
                            months[item.categoryid] = months[item.categoryid].add(item.amount)
                        } else {
                            months[item.categoryid] = item.amount
                        }
                        return months
                    }, {})
                    reducedList.push(reducedData)
                })

                var totalAmountData = {}
                _.each(reducedList, function(value, key){
                    var yearlyAmount = _.reduce(value, function(memo, value) {
                        return memo.add(value)
                    }, 0)
                    totalAmountData[key+1] = yearlyAmount
                })

                var unformatQuarterPercentData = {}
                _.each(reducedList, function(value, key1){
                    var monthData = {}
                    _.each(value, function(value, key) {
                        var newKey
                        newKey = category[key]
                        if (monthData[newKey]) {
                            monthData[newKey] = monthData[newKey].add(value)
                        } else {
                            monthData[newKey] = value
                        }
                    })
                    _.each(monthData, function(value, key) {
                        monthData[key] = value.div(totalAmountData[key1+1]).mul(100).toFixed(2)
                    })
                    unformatQuarterPercentData[key1+1] = monthData
                })

                var quarterPercentData = []
                _.each(unformatQuarterPercentData, function(value, key){
                    var categoryPercentData = {}
                    categoryPercentData['title'] = req.params.year + ' 年 第 ' + key  + ' 季度支出 (百分比)'
                    categoryPercentData['data'] = value
                    quarterPercentData.push(categoryPercentData)
                })
                res.json({
                    message: 0,
                    data: {
                        title: req.params.year.toString() + ' 年支出(季度)(百分比)',
                        data: quarterPercentData
                    }
                })
            } else {
                res.json({
                    message: 1,
                })
            }
        })
    } else {
        res.json({
            message: 0,
        })
    }
})


function getEntry(url) {
    var getEntryDefer = Q.defer()

    MongoClient.connect(url, function(err, db) {
        if (!err) {
            var entry = db.collection('entry')
            getEntryDefer.resolve(entry)
            console.log('%s MongoDB collection [entry] connection established!', chalk.blue('✓'));
        } else {
            getEntryDefer.reject()
            console.log('%s MongoDB collection [entry] failed!', chalk.red('✗'));
        }
    })

    return getEntryDefer.promise
}

module.exports = router
