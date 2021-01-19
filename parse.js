var request = require('request')
var cheerio = require('cheerio')
var iconv   = require('iconv-lite')

// load proxy server html content
const loadProxyServer = function(url, encoding = 'UTF-8'){
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

// parse html
const parse = function(htmlString) {
  return new Promise((resolve, reject) => {
    let $ = cheerio.load(htmlString, {decodeEntities: false})
    let array = [];

    $('.table-responsive tbody tr').each((index, item) => {
      let ip = $(item).find('td:nth-child(1)').html()
      let port = $(item).find('td:nth-child(2)').html()
      let address = $(item).find('td:nth-child(4)').html()

      
      array[array.length] = {
        ip: ip,
        port: port,
        address: address
      }
        
      // end    
    })

    resolve(array)
  })
}

// show
let url = 'https://seofangfa.com/proxy/'
loadProxyServer(url)
.then(parse)
.then(console.log)





