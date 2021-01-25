var request = require('request')
var iconv   = require('iconv-lite')
var cheerio = require('cheerio')
var _ = require('lodash')

var global = require('./global')
var tool = require('./tool')

/**
 * 获取代理服务器地址
 * @return 代理服务器地址
 */
const loadProxyAddresses = async() => {
  const url = 'https://seofangfa.com/proxy/'

  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if(res.statusCode != 200) {
        reject(`http code ${res.statusCode}, message: ${res.statusMessage}`)
        return
      }

      let $ = cheerio.load(body)

      let results = []

      let lines = $('.table tbody tr')
      for(let i = 0; i < 5; i++) {
        let tds = $(lines[i]).find('td')
        let ip = $(tds[0]).html()
        let port = $(tds[1]).html()
        tool.array.add(`http://${ip}:${port}`, results)
      }
      
      resolve(results)
    }) // end request

  }) // end promise

}

/**
 * 获取网页内容
 * @param url URL地址
 * @param encoding 网页编码
 * @return 网页内容
 */
const get = async(url, encoding = 'UTF-8') => {

  let optinos = {
    url: url,
    method: 'GET',
    encoding: null,
    headers: {
      Cookie: global.config.COOKIE,
      Accept: 'text/html'
    },
    timeout: 5000
  }

  // 使用代理
  if(global.config.proxy.enable) {
    optinos.proxy = global.config.proxy.address
    optinos.rejectUnauthorized = false
  }

  return new Promise((resolve, reject) => {
    request(optinos, (err, res, body) => {
      if(err) {
        reject(err)
        return
      }

      if(res.statusCode != 200) {
        reject(`http code ${res.statusCode}, message: ${res.statusMessage}`)
        return
      }

       resolve(iconv.decode(body, encoding).toString())
    })
  })
}


module.exports = {
  loadProxyAddresses: loadProxyAddresses,
  get: get
}

// loadProxyAddress().then(console.log).catch(console.error)

// global.config.proxy.enable = true
// global.config.proxy.auto = true
// get('https://www.baidu.com').then(console.log).catch(console.error)

