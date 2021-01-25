var cheerio = require('cheerio')
var _ = require('lodash')

var http = require('./http')
var server = require('./server')
var tool = require('./tool')
var global = require('./global')

/**
 * 根据URL地址加载
 * @param url URL地址
 * @return IP集合
 */
const loadByUrl = async(url) => {
  return http.get(url)
    .then(cheerio.load)
    .then($ => {

      // 城市信息
      let lines = $('#GridViewOrder tbody tr')
      console.log(`lines: ${lines.length}`)
      var results = []
      for(let i = 1; i < lines.length; i++) {
        let datas = $(lines[i]).find('td')
        let start = $(datas[1]).html()
        let end = $(datas[2]).html()
        let description = $(datas[3]).html()
        tool.array.add({start: start, end: end, description: description}, results)
      }

      return results
    })
    .catch(err => {
      console.error(err)
      return []
    })

}

/**
 * 根据城市名称加载
 * @param cityName 城市名称
 * @return IP集合
 */
const loadByName = async(cityName) => {

  let count = 0

  const loadCurrentPage = async(cityName, pageNo) => {
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
          tool.array.add({start: start, end: end, description: description}, results)
        }

        return results
      })
      .catch(err => {
        console.error(err)
        return []
      })

  }

  let pageNo = 1
  const pageSize = 100
  let datas = []
  while(true) {
    // load
    console.log(`loading page ${pageNo}`)
    let ips = await loadCurrentPage(cityName, pageNo)
    tool.array.addAll(ips, datas)
    // sleep
    await tool.sleep(global.config.waitMillis)

    if(pageNo * pageSize >= count) {
      break
    }
    pageNo++

  }
  console.log(`count: ${count}`)

  return datas
}

/**
 * 加载城市IP地址
 * @param name 名称
 * @param url URL地址
 */
const load = async(name, url) => {

  let ips = []

  // 先根据URL地址加载
  const URL_MAX_COUNT = 1000

  // 如果尝试使用URL加载
  if(global.config.tryLoadByUrl) {
    console.log(`load by url ${url}`)
    ips = await loadByUrl(url)
  }

  // 如果总数量大于最大数量，根据名称加载
  if(ips.length == 0 || ips.length >= URL_MAX_COUNT) {
    console.log(`load by name ${name}`)
    ips = await loadByName(name)
  }

  return ips
}


module.exports = {
  load: load,
}


// loadByUrl('http://ip.yqie.com/cn/shandong/qingdao/').then(console.log).catch(console.error)

// loadByName('青岛市').then(console.log).catch(console.error)

// load('青岛市', 'http://ip.yqie.com/cn/shandong/qingdao/').then(console.log).catch(console.error)
