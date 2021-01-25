var cheerio = require('cheerio')
var _ = require('lodash')

var http = require('./assets/http')
var server = require('./assets/server')
var tool = require('./assets/tool')

/**
 * 加载所有的地址信息
 */
const loadAddresses = async() => {
  let url = 'http://ip.yqie.com/china.aspx'
  return http.get(url)
    .then(cheerio.load)
    .then($ => {

      let provinces = []

      // 读取省份
      let lines = $('#page .menucity')
      for(let i = 1; i < lines.length; i++) {
        let provinceName = $(lines[i]).find('a').html()


        let array = $(lines[i]).find('li a')

        let cities = []
        let province = {provinceName: provinceName, cities: cities}

        // add city
        for(let j = 0; j < array.length; j++) {
          let url = $(array[j]).attr('href')
          let cityName = $(array[j]).text()
          cityName = tool.removeBrackets(cityName)

          let city = {cityName: cityName, url: 'http://ip.yqie.com' + url}
          tool.array.add(city, cities)
        }  // end city for

        provinces[provinces.length] = province
      }

      return provinces
    })
}


module.exports = {
  loadAddresses: loadAddresses
}



// loadAddresses().then(console.log)





