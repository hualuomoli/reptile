var cheerio    = require('cheerio')
var htmlLoader = require('./html-loader.js')

const url = 'https://seofangfa.com/proxy/'

const parse = function(html) {
  return new Promise((resolve, reject) => {
    let $ = cheerio.load(html, {decodeEntities: false})
    let array = [];

    $('.table-responsive tbody tr').each((index, item) => {
      let ip = $(item).find('td:nth-child(1)').html()
      let port = $(item).find('td:nth-child(2)').html()
      let address = $(item).find('td:nth-child(4)').html()

      // only 
      if(address.startsWith('中国')) {
        array[array.length] = {ip: ip, port: port}
      }
      
    }) // end each

    resolve(array)
  })
}

const loadAll = function() {
  return new Promise((resolve, reject) => {
    htmlLoader.get(url).then(parse).then(resolve)
  })
}

const loadOne = function() {
  return new Promise((resolve, reject) => {
    htmlLoader.get(url).then(parse).then(array => {
      
      // null
      if(array.length == 0) {
        resolve(null)
        return
      }

      resolve(array[0])
    })
  })
}

module.exports = {
  loadAll: loadAll,
  loadOne: loadOne,
  load   : loadOne
}





