const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')

// dependencies
require('dotenv').config()
const chalk = require('chalk')
const pg = require('pg')

/**
 * Express configuration.
 */
var app = express()
app.set('port', process.env.PORT || 3000)

// nunjucks template settings
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  watch: true,
  noCache: true,
  express: app
})
app.set('view engine', 'html')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/img/', 'favicon.png')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/', indexRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s Express server listening on port %d in %s mode.', chalk.blue('✓'), app.get('port'), app.get('env'))
})

module.exports = app
