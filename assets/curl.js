var child_process = require("child_process")
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
const get = async(url) => {
  const command = `curl -X GET --header 'Cookie:${config.cookie}' --header 'ACCPET:test/html;charset=${config.encoding}' ${url}`
  const options = {'maxBuffer': 100 * 1024 * 1024}

  return new Promise((resolve, reject) => {
    child_process.exec(command, options, (err, stdout, stderr) => {
      if(err) {
        reject(err)
        return
      }

      resolve(stdout.toString(config.encoding))
    })
  })
}


module.exports = {
  init: init,
  get: get
}
