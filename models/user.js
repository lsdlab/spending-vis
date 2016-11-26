const Q = require('q')
const bcrypt = require('bcrypt-nodejs')
const db = require('../routes/db')

/**
 * find existing user
 */
function findUserByID(id) {
  var userPromise = db.one('select * from users where id=$1', [id])
  return userPromise
}

function updateProfile(email, name, bio, url, location, id) {
  var userPromise = db.none('update users set email=$1, name=$2, bio=$3, url=$4, location=$5 where id=$6', [email, name, bio, url, location, id])
  return userPromise
}

/**
 * Helper method for validating user's password.
 */
function comparePassword(candidatePassword, userPassword) {
  var comparePasswordDefer = Q.defer()

  bcrypt.compare(candidatePassword, userPassword, (err, isMatch) => {
    if (err) {
      comparePasswordDefer.reject(err)
    } else {
      comparePasswordDefer.resolve(isMatch)
    }
  })

  return comparePasswordDefer.promise
}


module.exports.findUserByID = findUserByID
module.exports.updateProfile = updateProfile
module.exports.comparePassword = comparePassword
