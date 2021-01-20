var cheerio = require('cheerio')

var http = require('./http')
var server = require('./server')
var tool = require('./tool')

const download = async(countryName) => {
  
  const loadProvinceNames = async () => {
    let url = 'http://ip.yqie.com/china.aspx'
    return http.get(url)
      .then(cheerio.load)
      .then($ => {
        let provinces = $('#page .menucity')

        let provinceNames = []
        for(let i = 1; i < provinces.length; i++) {
          let provinceName = $(provinces[i]).find('a').html()
          provinceNames[provinceNames.length] = provinceName
        }

        return provinceNames
      })
   }


  console.group(countryName)
  let provinceNames = await loadProvinceNames()

  for(let i = 0; i < provinceNames.length; i++) {
    await loadProvince(countryName, provinceNames[i])
    await tool.sleep(20000)
  }
  console.groupEnd()
  // end
}

/**
 * 加载省份IP地址
 * @param provinceName 省份名称
 */
const loadProvince = async(countryName, provinceName) => {

  const loadCityNames = async (name) => {
    let url = 'http://ip.yqie.com/china.aspx'
    return http.get(url)
      .then(cheerio.load)
      .then($ => {
        let provinces = $('#page .menucity')

        for(let i = 1; i < provinces.length; i++) {
          let provinceName = $(provinces[i]).find('a').html()
          if(provinceName !== name) {
            continue
          }

          let array = $(provinces[i]).find('li a')
          let cityNames = []
          for(let j = 0; j < array.length; j++) {
            let cityName = $(array[j]).text()
            cityName = tool.removeBrackets(cityName)
            cityNames[cityNames.length] = cityName
          }  // end city for

          return cityNames
        } // end province for

        return []
      })
   }

   console.group(provinceName)
   let cityNames = await loadCityNames(provinceName)
   let cityPrefix
   for(let i = 0; i < cityNames.length; i++) {
     await loadCity(countryName, provinceName, cityNames[i])
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
  server.save(datas)
  console.groupEnd()
}


// 执行
// server.cleanAll().then(download("中国"))
server.clean('中国', '山东省', '青岛市').then(loadCity('中国', '山东省', '青岛市'))

