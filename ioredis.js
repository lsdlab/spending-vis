require('dotenv').config()
const chalk = require('chalk')

const Redis = require('ioredis')
const redis = new Redis({
  port: 6379,
  host: '127.0.0.1',
  family: 4,
  password: '0219',
  db: 0
})

console.log('%s Redis connection established!', chalk.blue('✓'))

// Exporting the redis object for shared use:
module.exports = redis
