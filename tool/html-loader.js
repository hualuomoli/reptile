var request = require('request')
var iconv   = require('iconv-lite')

const get = function(url, encoding = 'UTF-8'){

  return new Promise((resolve, reject) => {
    request({
      url: url,
      encoding: null
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