var request = require('request')
var iconv   = require('iconv-lite')

var global = require('./global')

const get = function(url, encoding = 'UTF-8'){

  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'GET',
      encoding: null,
      headers: {
        Cookie: global.config.COOKIE
      }
    }, (err, res, body) => {
       if(err) {
         reject(err)
         return
       }

       resolve(iconv.decode(body, encoding).toString())
    })
  })
}


module.exports = {
  get: get
}