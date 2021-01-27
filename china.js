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

        tool.array.add(province, provinces)
      }

      return provinces
    })
}

// 执行
loadAddresses()
.then(provinces => {
  
  console.log(`var server = require('./assets/server')`)
  console.log(`var parser = require('./assets/parser')`)
  console.log(`\n`)

  console.log(`
const handle = async(countryName, provinceName, cityName, cityUrl) => {
  await server.clean(countryName, provinceName, cityName)
  let ips = await parser.load(cityName, cityUrl)
  let ip
  for(let  i = 0; i < ips.length; i++) {
    ip = ips[i]
    ip.countryName = countryName
    ip.provinceName = provinceName
    ip.cityName = cityName
  }
  await server.save(ips)
}
  `)

  console.log(`const main = async() => {\n`)

  const countryName = '中国'

  const pageNo = 1
  const pageSize = 10
  const start = (pageNo - 1) * pageSize + 1
  const end = pageNo * pageSize
  let index = 0

  // province
  outer:
  for(let i = 0; i < provinces.length; i++) {
    let provinceName = provinces[i].provinceName
    let cities = provinces[i].cities

    console.log(`\n`)
    console.log(`console.log('${provinceName}')`)

    // city
    for(j = 0; j < cities.length; j++) {
      index++

      // from
      if(index < start) {
        continue
      }

      // to
      if(index > end) {
        break outer
      }

      let cityName = cities[j].cityName
      let cityUrl = cities[j].url
      console.log(`await handle('${countryName}', '${provinceName}', '${cityName}', '${cityUrl}')`)
      
      

    }

    
    
  }

  console.log(`\n\n}\n\n`)
  console.log(`main()`)
  console.log(`\n\n`)

})


