var cheerio = require('cheerio')
var _ = require('lodash')

var http = require('./assets/http')
var server = require('./assets/server')
var tool = require('./assets/tool')

/**
 * 加载所有的地址信息
 */
const loadAddresses = async() => {
  let url = 'http://ip.yqie.com/world.aspx'
  return http.get(url)
    .then(cheerio.load)
    .then($ => {

      let continents = []

      // 读取州
      let lines = $('#site-nav .menu')
      for(let i = 1; i < lines.length; i++) {
        let continentName = $(lines[i]).find('b').html()


        let array = $(lines[i]).find('li a')

        let countries = []
        let continent = {continentName: continentName, countries: countries}

        // add country
        for(let j = 0; j < array.length; j++) {
          let url = $(array[j]).attr('href')
          let countryName = $(array[j]).text()
          countryName = tool.removeBrackets(countryName)

          let country = {countryName: countryName, url: 'http://ip.yqie.com' + url}
          tool.array.add(country, countries)
        }  // end country for

        tool.array.add(continent, continents)
      }

      return continents
    })
}

// 执行
loadAddresses()
.then(continents => {
  
  console.log(`var server = require('./assets/server')`)
  console.log(`var parser = require('./assets/parser')`)
  console.log(`\n`)

  console.log(`
const handle = async(name, url) => {
  await server.clean(name)
  let ips = await parser.load(name, url)
  let ip
  for(let  i = 0; i < ips.length; i++) {
    ip = ips[i]
    ip.countryName = name
    ip.provinceName = '_'
    ip.cityName = '_'
  }
  await server.save(ips)
}
  `)

  console.log(`const main = async() => {\n`)

  const countryName = '中国'
  // province
  for(let i = 0; i < continents.length; i++) {
    let continentName = continents[i].continentName
    let countries = continents[i].countries

    console.log(`\n`)
    console.log(`// ${continentName}`)
    // country
    for(j = 0; j < countries.length; j++) {
      let name = countries[j].countryName
      let url = countries[j].url
      console.log(`// await handle('${name}', '${url}')`)
    }

    
    
  }

  console.log(`\n\n}\n\n`)
  console.log(`main()`)
  console.log(`\n\n`)

})


