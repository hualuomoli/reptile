const fs      = require('fs')
const path    = require('path')
const cheerio = require('cheerio')
const _       = require('lodash')

const http   = require('./assets/http')
const curl   = require('./assets/curl')
const tool   = require('./assets/tool')
const logger = require('./assets/logger')
const parser = require('./service/parser')

const filename = '.china.tmp'
const cookie_filename = '.cookie.tmp'

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
        // add city
        for(let j = 0; j < array.length; j++) {
          let url = $(array[j]).attr('href')
          let cityName = $(array[j]).text()
          // cityName = tool.removeBrackets(cityName)

          cities.push({
            cityName: cityName,
            url: 'http://ip.yqie.com' + url
          })

        }  // end city for

        provinces.push({
          provinceName: provinceName,
          cities: cities
        })
      }

      return provinces
    })
}

// 暂停
const pause = async(provinceName, cityName, message = '') => {
  return new Promise((resolve, reject) => {
    let file = path.resolve(__dirname, filename)
    let content = JSON.stringify({provinceName: provinceName, cityName: cityName, message: message})
    let options = {encoding: 'UTF-8'}
    
    fs.writeFile(file, content, options, err => {
      
      // error
      if(err) {
        reject(err)
        return
      }

      // success
      resolve()
    })
  }) // end promise
}

// 继续
const resume = async() => {
  return new Promise((resolve, reject) => {
    let file = path.resolve(__dirname, filename)

    fs.readFile(file, 'UTF-8', (err, data) => {
      
      // error
      if(err) {
        reject(err)
        return
      }

      // success
      resolve(JSON.parse(data))
    })
  }) // end promise
}

// 初始化
const init = async() => {
  return new Promise((resolve, reject) => {
    let file = path.resolve(__dirname, cookie_filename)

    fs.readFile(file, 'UTF-8', (err, cookie) => {
      
      // error
      if(err) {
        reject(err)
        return
      }

      http.init(cookie)
      curl.init(cookie)

      // success
      resolve(cookie)
    })
  }) // end promise
}

// 处理
const handle = async(provinceName, city) => {

  return parser.load(city.cityName, city.url)
    .then(datas => {

      // save
      logger.info(`${city.cityName} ip count ${datas.length}`)

      return {
        success: true,
        datas: datas
      }
    })
    .catch(err => {
      logger.warn(`${city.cityName} load fail.`)

      return {
        success: false,
        message: err
      }
    })

}

// run
const run = async() => {

  // 初始化
  await init()

  // 查询省市
  let provinces = await loadAddresses()

  // 查询上次保存的省市信息
  let tmpInfo
  try {
    tmpInfo = await resume()
  } catch(err) {
    tmpInfo = {provinceName: provinces[0].provinceName, cityName: provinces[0].cities[0].cityName}
  }
  logger.info(`last reptile ${tmpInfo.provinceName}/${tmpInfo.cityName}`)

  let canHanle = false

  outer:
  for(let i = 0; i < provinces.length; i++) {
    let province = provinces[i]
    let cities = province.cities

    // 还没有找到符合的省份
    if(!canHanle && province.provinceName != tmpInfo.provinceName) {
      continue
    }

    for(let j = 0; j < cities.length; j++) {
      let city = cities[j]
      if(!canHanle && city.cityName != tmpInfo.cityName) {
        continue
      }
      canHanle = true

      // handle
      let handleResult = await handle(province.provinceName, city)
      if(!handleResult.success) {
        logger.log(handleResult.message)
        pause(province.provinceName, city.cityName, handleResult.message)
        break outer
      }
      
    }

  }
  logger.info('end.........')
}


// pause('山东', '青岛市')
// resume().then(console.log)

logger.init(logger.config.INFO)
parser.init(2000)
run()
