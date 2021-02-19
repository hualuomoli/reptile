const cheerio = require('cheerio')
const _       = require('lodash')

const tool    = require('../assets/tool')
const http    = require('../assets/http')
const curl    = require('../assets/curl')
const logger  = require('../assets/logger')


let config = {
  oneceWaitMillis: 0
}

/**
 * 初始化
 * @param oneceWaitMillis 每次执行网络请求间隔时间
 */
function init(oneceWaitMillis) {
    config = _.extend({}, {oneceWaitMillis: oneceWaitMillis})

}

/**
 * 根据URL地址加载
 * @param url URL地址
 * @return IP集合
 */
const loadByUrl = async(url) => {

  return curl.get(url)
    .then(cheerio.load)
    .then($ => {

      // 总记录数
      let tip = $('#GridViewOrder').parent().text().substring(0, 20)
      let count = parseInt(tip.substring('最多只能列出前'.length, tip.indexOf('条IP信息')))

      // 城市信息
      let lines = $('#GridViewOrder tbody tr')
      var results = []
      for(let i = 1; i < lines.length; i++) {
        let datas = $(lines[i]).find('td')
        let start = $(datas[1]).html()
        let end = $(datas[2]).html()
        let description = $(datas[3]).html()
        results.push({start: start, end: end, description: description})
      }

      return {
        count: count,
        datas: results,
        done: count != results.length
      }

    })

}

/**
 * 根据名称加载
 * @param name 城市名称
 * @param pageNo 当前页码
 * @return IP集合
 */
const loadByName = async(name, pageNo = 1) => {
  // url
  let url = `http://ip.yqie.com/vip/search.aspx?pagecurrent=${pageNo}&searchword=${encodeURI(name)}`
  
  return http.get(url)
    .then(cheerio.load)
    .then($ => {

      // 总记录数
      let countSpan = $('#GridViewOrder').siblings('span')[0]
      let count = parseInt($(countSpan).html().split('：')[1])

      // 总页码
      let pageSpan = $('#GridViewOrder').siblings('span')[1]
      let pageInfo = $(pageSpan).html().split('：')[1]
      let currentPage = parseInt(pageInfo.split('/')[0])
      let totalPage = parseInt(pageInfo.split('/')[1])

      logger.trace(`name: ${name}, count: ${count}, current: ${currentPage}, total: ${totalPage}`)

      // 城市信息
      let lines = $('#GridViewOrder tbody tr')
      var results = []
      for(let i = 1; i < lines.length; i++) {
        let datas = $(lines[i]).find('td')
        let start = $(datas[0]).html()
        let end = $(datas[1]).html()
        let description = $(datas[2]).html()
        results.push({start: start, end: end, description: description})
      }

      return {
        count: count,
        datas: results,
        done: currentPage == totalPage
      }

    })

  // end

}

/**
 * 根据IP或名称加载
 * name 名称
 * url URL地址
 * return IP地址集合
 */
const load = async(name, url) => {

  let result = {}

  // load by url
  logger.debug(`${name} 根据URL拉取. ${url}`)
  result = await loadByUrl(url)
  if(result.done) {
    return result.datas
  }

  // 等待一段时间再处理,防止被服务器封锁
  await tool.sleep(config.oneceWaitMillis)

  // load by name
  logger.debug(`${name} 根据名称拉取`)
  {
    let index = 1
    let results = []
    let result = {}
    while(true) {

      // 加载
      result = await loadByName(name, index)
      results.push(...result.datas)

      // 等待一段时间再处理,防止被服务器封锁
      await tool.sleep(config.oneceWaitMillis)

      // 已完成
      if(result.done) {
        break
      }

      // 查询下一页
      index++
    }

    return Promise.resolve(results)
  }

  // end
}

module.exports = {
  init: init,
  loadByUrl: loadByUrl,
  loadByName: loadByName,
  load: load
}


