var request = require('request')
var iconv   = require('iconv-lite')

var global = require('./global')

const get = function(url, encoding = 'UTF-8') {

  let config = {
    url: url,
    method: 'GET',
    encoding: null,
    headers: {
      Cookie: global.config.COOKIE
    }
  }

  // 使用代理
  if(global.config.proxy.enable) {
    config.proxy = global.config.proxy.url
    config.rejectUnauthorized = false
  }

  return new Promise((resolve, reject) => {
    request(config, (err, res, body) => {
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