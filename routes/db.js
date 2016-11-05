require('dotenv').config()
const chalk = require('chalk')
// Proper way to initialize and share the Database object
// Loading and initializing the library:
const pgp = require('pg-promise')({
    // Initialization Options
})

// Preparing the connection details:
const cn = process.env.POSTGRESQL_URL

// Creating a new database instance from the connection details:
const db = pgp(cn)

console.log('%s PostgreSQL connection established!', chalk.blue('✓'))

// Exporting the database object for shared use:
module.exports = db
