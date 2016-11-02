require('dotenv').config()
require('../utils/utils')
const express = require('express')
const router = express.Router()

const chalk = require('chalk')
const MongoClient = require('mongodb').MongoClient
const _ = require('underscore')
const Q = require('q')


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


/* 所有数据 for tables */
router.get('/alldata', function(req, res) {
  if (entry['message'] !== 1) {
    entry.find({}, {'_id':0, 'day':0, 'month':0, 'year':0, 'timestamp':0, 'cpi_index':0}).toArray(function(err, doc) {
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


/* 按年 每年的总支出金额 for charts-year */
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


/* 所有月份 每月的支出金额 for charts-year */
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

/* 按年 每个月的支出金额 for charts-month */
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


/* 按年 每年的 CPI for charts-category-year */
router.get('/categorydatabyyear/:year(\\d{4})', function(req, res) {
  if (entry['message'] !== 1) {
    entry.find({
      'year': req.params.year
    }).toArray(function(err, doc) {
      if (doc != null) {
        var reducedData = _.reduce(doc, function(months, item) {
          if (months[item.cpi_text]) {
            months[item.cpi_text] = months[item.cpi_text].add(item.amount)
          } else {
            months[item.cpi_text] = item.amount
          }
          return months
        }, {})

        var totalAmount = _.reduce(reducedData, function(memo, value) {
          return memo.add(value)
        }, 0)
        _.each(reducedData, function(value, key) {
          reducedData[key] = value.div(totalAmount).mul(100).toFixed(2)
        })

        var formatedData = {}
        formatedData['食品'] = reducedData['食品']
        formatedData['穿'] = reducedData['穿']
        formatedData['居住'] = reducedData['居住']
        formatedData['交通通信'] = reducedData['交通通信']
        formatedData['教育'] = reducedData['教育']
        formatedData['文化娱乐'] = reducedData['文化娱乐']

        res.json({
          message: 0,
          data: {
            title: req.params.year.toString() + ' 年各分类支出占比',
            data: formatedData
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


/* 按年 每个季度的 CPI for charts-category-quarter */
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
        _.each(quarterData, function(quarterItem) {
          var reducedData = _.reduce(quarterItem, function(months, item) {
            if (months[item.cpi_text]) {
              months[item.cpi_text] = months[item.cpi_text].add(item.amount)
            } else {
              months[item.cpi_text] = item.amount
            }
            return months
          }, {})
          reducedList.push(reducedData)
        })

        var totalAmountData = {}
        _.each(reducedList, function(value, key) {
          var yearlyAmount = _.reduce(value, function(memo, value) {
            return memo.add(value)
          }, 0)
          totalAmountData[key + 1] = yearlyAmount
        })

        var unformatQuarterData = []
        _.each(reducedList, function(value) {
          if (value != { }) {
            var formatedData = {}
            formatedData['食品'] = value['食品']
            formatedData['穿'] = value['穿']
            formatedData['居住'] = value['居住']
            formatedData['交通通信'] = value['交通通信']
            formatedData['教育'] = value['教育']
            formatedData['文化娱乐'] = value['文化娱乐']
            unformatQuarterData.push(formatedData)
          }
        })

        var unformatQuarterPercentData = []
        _.each(unformatQuarterData, function(value, key) {
          var formatQuarterDataItem = {}
          _.each(value, function(value1, key1){
            if (value1) {
              formatQuarterDataItem[key1] = value1.div(totalAmountData[key + 1]).mul(100).toFixed(2)
            }

          })
          unformatQuarterPercentData.push(formatQuarterDataItem)
        })

        var quarterPercentData = []
        _.each(unformatQuarterPercentData, function(value, key) {
          var newkey = key + 1
          var categoryPercentData = {}
          categoryPercentData['title'] = req.params.year + ' 年 第 ' + newkey + ' 季度支出 (百分比)'
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


/* 最近复五个月每月总支出 for brief */
router.get('/pre5month', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  if (entry['message'] !== 1) {
    entry.find({
      'year': year.toString(),
      'month': { '$gte': (month - 4).toString()}
    }).toArray(function(err, doc0) {
      if (doc0 != null) {
        entry.find({
          'year': year.toString(),
          'month': month.toString()
        }).toArray(function(err, doc1) {
          var doc = _.extend(doc0, doc1)
          var pre5monthData = _.reduce(doc, function(allmonths, item) {
            var dataKey
            dataKey = item.year + '-' + item.month
            if (allmonths[dataKey]) {
              allmonths[dataKey] = allmonths[dataKey].add(item.amount)
            } else {
              allmonths[dataKey] = item.amount
            }
            return allmonths
          }, {})

          // TODO

          res.json({
            message: 0,
            data: {
              title: year + ' 年 ' + (month - 4).toString() + ' 至 ' + month.toString() + ' 月' + '最近五个月支出（元/月）',
              data: pre5monthData
            }
          })
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


/* 当月 CPI for brief */
router.get('/thismonthpercent', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  if (entry['message'] !== 1) {
    entry.find({
      'year': year.toString(),
      'month': month.toString()
    }).toArray(function(err, doc) {
      if (doc != null) {
        var reducedData = _.reduce(doc, function(months, item) {
          if (months[item.cpi_text]) {
            months[item.cpi_text] = months[item.cpi_text].add(item.amount)
          } else {
            months[item.cpi_text] = item.amount
          }
          return months
        }, {})

        var totalAmount = _.reduce(reducedData, function(memo, value) {
          return memo.add(value)
        }, 0)
        _.each(reducedData, function(value, key) {
          reducedData[key] = value.div(totalAmount).mul(100).toFixed(2)
        })

        var formatedData = {}
        formatedData['食品'] = reducedData['食品']
        formatedData['穿'] = reducedData['穿']
        formatedData['居住'] = reducedData['居住']
        formatedData['交通通信'] = reducedData['交通通信']
        formatedData['教育'] = reducedData['教育']
        formatedData['文化娱乐'] = reducedData['文化娱乐']

        res.json({
          message: 0,
          data: {
            title: year.toString() + ' 年 ' + month.toString() + ' 月分类支出占比',
            data: formatedData
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


/* 当月分类支出金额 for brief */
router.get('/thismonthsummary', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  if (entry['message'] !== 1) {
    entry.find({
      'year': year.toString(),
      'month': month.toString()
    }).toArray(function(err, doc) {
      if (doc != null) {
        var reducedData = _.reduce(doc, function(months, item) {
          if (months[item.cpi_text]) {
            months[item.cpi_text] = months[item.cpi_text].add(item.amount)
          } else {
            months[item.cpi_text] = item.amount
          }
          return months
        }, {})

        var formatedData = {}
        formatedData['食品'] = reducedData['食品'] || 0
        formatedData['穿'] = reducedData['穿'] || 0
        formatedData['居住'] = reducedData['居住'] || 0
        formatedData['交通通信'] = reducedData['交通通信'] || 0
        formatedData['教育'] = reducedData['教育'] || 0
        formatedData['文化娱乐'] = reducedData['文化娱乐'] || 0

        res.json({
          message: 0,
          data: {
            title: year.toString() + ' 年 ' + month.toString() + ' 月分类支出概要',
            data: formatedData
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


/* 当月最大六笔支出 */
router.get('/thismonthmaxsix', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  if (entry['message'] !== 1) {
    entry.find({
      'year': year.toString(),
      'month': month.toString()
    }).sort({ 'amount': -1 }).limit(6).toArray(function(err, doc) {
      if (doc != null) {

        var formatedData = []
        _.each(doc, function(item) {
          var formatedItem = {}

          _.each(item, function(firstvalue, key) {
            if (key === 'note') {
              formatedItem['note'] = firstvalue
            }

            if (key === 'amount') {
              formatedItem['amount'] = firstvalue
            }
            if (key === 'cpi_text') {
              formatedItem['cpi_text'] = firstvalue
            }
          })
          formatedData.push(formatedItem)
        })

        res.json({
          message: 0,
          data: {
            title: year.toString() + ' 年 ' + month.toString() + ' 月金额最大的六笔支出',
            data: formatedData
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

/* 当月所有数据 for brief */
router.get('/thismonthtable', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  if (entry['message'] !== 1) {
    entry.find({
      'year': year.toString(),
      'month': month.toString()
    }, {'_id':0, 'day':0, 'month':0, 'year':0, 'timestamp':0, 'cpi_index':0}).toArray(function(err, doc) {
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


function getEntry(url) {
  var getEntryDefer = Q.defer()

  MongoClient.connect(url, function(err, db) {
    if (!err) {
      var entry = db.collection('entry')
      getEntryDefer.resolve(entry)
      console.log('%s MongoDB collection [entry] connection established!', chalk.blue('✓'))
    } else {
      getEntryDefer.reject()
      console.log('%s MongoDB collection [entry] failed!', chalk.red('✗'))
    }
  })

  return getEntryDefer.promise
}

module.exports = router
