const cheerio = require('cheerio')
const _       = require('lodash')


const tool    = require('../assets/tool')
const http    = require('../assets/http')
const curl    = require('../assets/curl')


let config = {
  oneceWaitMillis: 0,
  failWailtMillis: 0,
  retryCount: 1
}

/**
 * 初始化
 * @param oneceWaitMillis 每次执行网络请求间隔时间
 * @param failWailtMillis 执行失败重发间隔时间
 * @param retryCount 重试次数
 */
function init(oneceWaitMillis, failWailtMillis, retryCount = 1) {
    config = _.extend({}, {oneceWaitMillis: oneceWaitMillis, failWailtMillis: failWailtMillis, retryCount: retryCount})

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

      return results
    })

}

/**
 * 根据名称加载
 * @param name 城市名称
 * @param pageNo 当前页码
 * @return IP集合
 */
const loadByName = async(name) => {

  const load = async(name, pageNo) => {
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

        console.log(`name: ${name}, count: ${count}, current: ${currentPage}, total: ${totalPage}`)

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

  // 重试加载
  const retryLoad = async(name, pageNo, retryCount = 1) => {

    let err
    try {
      return load(name, pageNo)
    } catch(e) {
      err = e
      tool.sleep(config.failWailtMillis)
    }

    // 超过重试次数
    if(retryCount < config.retryCount) {
      return Promise.reject(err)
    }

    return retryLoad(name, pageNo, retryCount + 1)
  }


  let index = 1
  let results = []
  while(true) {

    // 加载
    let data = await retryLoad(name, index)
    results.push(...data.datas)

    // 等待一段时间再处理,防止被服务器封锁
    await tool.sleep(config.oneceWaitMillis)

    // 已完成
    if(data.done) {
      break
    }

    // 查询下一页
    index++
  }

  return Promise.resolve(results)
}

module.exports = {
  loadByUrl: loadByUrl,
  loadByName: loadByName
}


