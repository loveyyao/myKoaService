// token校验
const config = require('../config/default')
const jwt = require('jsonwebtoken')

module.exports = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token.split(' ')[1], config.secret, (err, decoded) => {
      if (err) {
        reject(err)
      }
      if (!err) {
        resolve(decoded)
      }
    })
  }).catch(err => {
    console.log('ver token err:', err)
  })
}
