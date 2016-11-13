require('dotenv').config()
require('../utils/utils')
const express = require('express')
const router = express.Router()

const db = require('./db')
const _ = require('underscore')


/* 所有数据 for tables */
router.get('/alldata', function(req, res) {
  db.any('SELECT * FROM entry')
    .then(function(data) {
      var alldata = _.map(data, function(item) {
        return {
          'cpi_text': item['cpi_text'],
          'date': item['date'].getFullYear() + '/' + (item['date'].getMonth() + 1) + '/' + item['date'].getDate(),
          'amount': item['amount'],
          'note': item['note']
        }
      })
      res.json({
        message: 0,
        data: alldata
      })
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 按年 每年的总支出金额 for charts-year */
router.get('/years', function(req, res) {
  db.any('SELECT * FROM entry')
    .then(function(data) {
      var reducedData = _.reduce(data, function(years, item) {
        if (years[item['date'].getFullYear()]) {
          years[item['date'].getFullYear()] = years[item['date'].getFullYear()].add(item.amount)
        } else {
          years[item['date'].getFullYear()] = item.amount
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
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 所有月份 每月的支出金额 for charts-year */
router.get('/allmonth', function(req, res) {
  db.any('SELECT * FROM entry')
    .then(function(data) {
      var allmonthData = _.reduce(data, function(allmonths, item) {
        var dataKey
        dataKey = item['date'].getFullYear() + '-' + (item['date'].getMonth() + 1)
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
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 按年 每个月的支出金额 for charts-month */
router.get('/monthdatabyyear/:year(\\d{4})', function(req, res) {
  db.any('SELECT * FROM entry WHERE Extract(year from date)=$1', [req.params.year])
    .then(function(data) {
      var reducedData = _.reduce(data, function(months, item) {
        if (months[item['date'].getMonth() + 1]) {
          months[item['date'].getMonth() + 1] = months[item['date'].getMonth() + 1].add(item.amount)
        } else {
          months[item['date'].getMonth() + 1] = item.amount
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
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 按年 每年的 CPI for charts-category-year */
router.get('/categorydatabyyear/:year(\\d{4})', function(req, res) {
  db.any('SELECT * FROM entry WHERE Extract(year from date)=$1', [req.params.year])
    .then(function(data) {
      var reducedData = _.reduce(data, function(months, item) {
        if (months[item.cpi_text]) {
          months[item.cpi_text] = months[item.cpi_text].add(item.amount)
        } else {
          months[item.cpi_text] = item.amount
        }
        return months
      }, {})

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
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 按年 每个季度的 CPI for charts-category-quarter */
router.get('/categorydatabyquarter/:year(\\d{4})', function(req, res) {
  db.any('SELECT * FROM entry WHERE Extract(year from date)=$1', [req.params.year])
    .then(function(data) {
      var quarterData = {}
      quarterData['1'] = []
      quarterData['2'] = []
      quarterData['3'] = []
      quarterData['4'] = []
      _.each(data, function(item) {
        var month = (item['date'].getMonth() + 1).toString()
        if (month === '1' || month === '2' || month === '3') {
          quarterData['1'].push(item)
        } else if (month === '4' || month === '5' || month === '5') {
          quarterData['2'].push(item)
        } else if (month === '7' || month === '8' || month === '9') {
          quarterData['3'].push(item)
        } else if (month === '10' || month === '11' || month === '12') {
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

      var unformatQuarterData = []
      _.each(reducedList, function(value) {
        if (value != {}) {
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
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 最近五个月每月总支出 for last-month-brief */
router.get('/last5month', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  if (month <= 4) {
    month = month + 12 - 4
    year = year - 1
  }
  db.any('SELECT * FROM entry WHERE Extract(year from date)=$1 and Extract(month from date)>=$2', [year, month - 4])
    .then(function(data) {
      var pre5monthData = _.reduce(data, function(allmonths, item) {
        var dataKey
        dataKey = (item['date'].getFullYear()).toString() + '-' + (item['date'].getMonth() + 1).toString()
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
          title: year.toString() + ' 年 ' + (month - 4).toString() + ' 至 ' + month.toString() + ' 月' + '最近五个月支出（元/月）',
          data: pre5monthData
        }
      })
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 上月 CPI for last-month-brief */
router.get('/lastmonthcpi', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  db.any('SELECT * FROM entry WHERE Extract(year from date)=$1 and Extract(month from date)=$2', [year, month])
    .then(function(data) {
      var reducedData = _.reduce(data, function(months, item) {
        if (months[item.cpi_text]) {
          months[item.cpi_text] = months[item.cpi_text].add(item.amount)
        } else {
          months[item.cpi_text] = item.amount
        }
        return months
      }, {})

      var formatedData = {}
      formatedData['食品'] = reducedData['食品'] || '0'
      formatedData['穿'] = reducedData['穿'] || '0'
      formatedData['居住'] = reducedData['居住'] || '0'
      formatedData['交通通信'] = reducedData['交通通信'] || '0'
      formatedData['教育'] = reducedData['教育'] || '0'
      formatedData['文化娱乐'] = reducedData['文化娱乐'] || '0'

      res.json({
        message: 0,
        data: {
          title: year.toString() + ' 年 ' + month.toString() + ' 月分类支出占比',
          data: formatedData
        }
      })
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 上月分类支出金额 for last-month-brief */
router.get('/lastmonthsummary', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  db.any('SELECT * FROM entry WHERE Extract(year from date)=$1 and Extract(month from date)=$2', [year, month])
    .then(function(data) {
      var reducedData = _.reduce(data, function(months, item) {
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
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 上月最大六笔支出 for last-month-brief */
router.get('/lastmonthmaxsix', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  db.any('SELECT * FROM entry WHERE Extract(year from date)=$1 and Extract(month from date)=$2 ORDER BY amount DESC LIMIT 6', [year, month])
    .then(function(data) {
      var formatedData = []
      _.each(data, function(item) {
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
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* 上月所有数据 for last-month-brief */
router.get('/lastmonthalldata', function(req, res) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth()
  db.any('SELECT * FROM entry WHERE Extract(year from date)=$1 and Extract(month from date)=$2', [year, month])
    .then(function(data) {
      var lastmonthdata = _.map(data, function(item) {
        return {
          'cpi_text': item['cpi_text'],
          'date': item['date'].getFullYear() + '/' + (item['date'].getMonth() + 1) + '/' + item['date'].getDate(),
          'amount': item['amount'],
          'note': item['note']
        }
      })
      res.json({
        message: 0,
        data: {
          title: year.toString() + ' 年 ' + month.toString() + ' 支出详细表格',
          data: lastmonthdata
        }
      })
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})

/* cpi_text and cpi_index for new */
router.get('/cpi-for-new', function(req, res) {
  res.json({
    message: 0,
    data: {
      title: 'CPI 分类 typeahead',
      data: ['0: 食品', '1: 穿', '2: 居住', '3: 交通通信', '4: 教育', '5: 娱乐通信']
    }
  })
})


/* all notes for new */
router.get('/allnotes-for-new', function(req, res) {
  db.any('SELECT * FROM entry')
    .then(function(data) {
      var allnotes = _.map(data, function(item){
        return item['note']
      })

      var obj = {}
      allnotes.forEach(function(id){obj[id] = true})
      allnotes = Object.keys(obj)

      res.json({
        message: 0,
        data: {
          title: '所有关键词 typeahead',
          data: allnotes
        }
      })
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


/* all notes for word cloud */
router.get('/allnotes-for-wordcloud', function(req, res) {
  db.any('SELECT * FROM entry')
    .then(function(data) {
      var allnotes = _.map(data, function(item){
        return item['note']
      })

      // make count for all notes
      var count = function(ary, classifier) {
        return ary.reduce(function(counter, item) {
          var p = (classifier || String)(item)
          counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1
          return counter
        }, {})
      }
      var allnotesCount = count(allnotes)

      var unsortedNotes = []
      _.each(allnotesCount, function(value, key){
        var noteObject = {}
        noteObject['text'] = key
        noteObject['counts'] = value
        unsortedNotes.push(noteObject)
      })

      var sortedNotes_40 = _.sortBy(unsortedNotes, 'counts').reverse().slice(0, 40)

      var sortedNotes = []
      _.each(sortedNotes_40, function(item){
        var count_item = []
        count_item.push(item.text)
        count_item.push(item.counts)
        sortedNotes.push(count_item)
      })

      res.json({
        message: 0,
        data: {
          title: '消费关键词词云',
          data: sortedNotes
        }
      })
    })
    .catch(function(error) {
      res.json({
        message: 1,
      })
    })
})


module.exports = router
