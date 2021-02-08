const request = require('request')
const iconv   = require('iconv-lite')
const _       = require('lodash')

// config
let config = {
  cookie: '',
  encoding: 'UTF-8'
}

/**
 * 初始化
 * @param cookie 会话Cookie
 * @param encoding 编码集
 */
function init(cookie, encoding = 'UTF-8') {
  config = _.extend({}, {cookie: cookie, encoding: encoding})
}


/**
 * 获取网页内容
 * @param url URL地址
 * @param timeout 超时时间
 * @return 网页内容
 */
const get = async(url, options = {}) => {

  const OPTIONS = {
    url: url,
    method: 'GET',
    encoding: null,
    headers: {
      Cookie: config.cookie
    }
  }

  return new Promise((resolve, reject) => {
    request(_.extend({}, OPTIONS, options), (err, res, body) => {
      if(err) {
        reject(err)
        return
      }

      if(res.statusCode != 200) {
        reject(`[${res.statusCode}] ${res.statusMessage}`)
        return
      }

       resolve(iconv.decode(body, config.encoding).toString())
    })
  })
}


module.exports = {
  init: init,
  get: get
}


