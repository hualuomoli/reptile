var cheerio = require('cheerio')

var http = require('./http')
var server = require('./server')
var tool = require('./tool')

const loadAddresses = async(countryName) => {
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
          cityName = $(array[j]).text()
          cityName = tool.removeBrackets(cityName)
          let city = {cityName: cityName}
          cities[cities.length] = city
        }  // end city for

        provinces[provinces.length] = province
      }

      return {countryName: countryName, provinces: provinces}
    })
}

/**
 * 加载省份
 * @param countryName 国家名称
 * @param provinceName 省份名称
 * @param cityNames 城市名称
 */
const loadProvince = async(countryName, provinceName, cityNames) => {
  console.group(provinceName)

  for(let j = 0; j < cityNames.length; j++) {
    let cityName = cityNames[j]
    await loadCity(countryName, provinceName, cityName)
    tool.sleep(5000)
  }

  console.groupEnd()
}

/**
 * 加载城市IP地址
 * @param provinceName 省份名称
 * @param cityName 城市名称
 */
const loadCity = async(countryName, provinceName, cityName) => {

  let pageSize = 100
  let count = 0

  const load = async(cityName, pageNo) => {
    let url = `http://ip.yqie.com/vip/search.aspx?searchword=${encodeURI(cityName)}&pagecurrent=${pageNo}`

    return http.get(url)
      .then(cheerio.load)
      .then($ => {

        // 总数量
        let spans = $('#GridViewOrder').prevAll('span')
        if(count == 0) {
          count = parseInt($(spans[0]).html().substring('总记录：'.length))
        }

        // 城市信息
        let lines = $('#GridViewOrder').find('tr')
        var results = []
        for(let i = 1; i < lines.length; i++) {
          let datas = $(lines[i]).find('td')
          let start = $(datas[0]).html()
          let end = $(datas[1]).html()
          let description = $(datas[2]).html()
          results[results.length] = {
            countryName: countryName,
            provinceName: provinceName,
            cityName: cityName,
            start: start,
            end: end,
            description: description
          }
        }

        return results
      })
  }

  let pageNo = 1
  let datas = []
  console.group(cityName)
  while(true) {
    console.log(`loading page ${pageNo} in ${count}`)
    // load
    let ips = await load(cityName, pageNo)
    tool.array.addAll(ips, datas)
    // sleep
    await tool.sleep(1000)

    if(pageNo * pageSize >= count) {
      break
    }
    pageNo++

  }
  await server.save(datas)
  console.groupEnd()
}


module.exports = {
  loadAddresses: loadAddresses,
  loadProvince: loadProvince,
  loadCity: loadCity
}


// 加载所有的省市名称
// loadAddresses('中国').then(obj => console.log(JSON.stringify(obj)))

// 加载市
// server.clean('中国', '山东', '青岛市').then(loadCity('中国', '山东', '青岛市'))

// 加载省
// server.clean('中国', '山东').then(loadProvince('中国', '山东', ['青岛市', '济南市']))



