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
  await server.clean(name, '/', '/')
  let ips = await parser.load(name, url)
  let ip
  for(let  i = 0; i < ips.length; i++) {
    ip = ips[i]
    ip.countryName = name
    ip.provinceName = '/'
    ip.cityName = '/'
  }
  await server.save(ips)
}
  `)

  console.log(`const main = async() => {\n`)

  const pageNo = 1
  const pageSize = 10
  const start = (pageNo - 1) * pageSize + 1
  const end = pageNo * pageSize
  let index = 0
  let len = 0

  // continent
  outer:
  for(let i = 0; i < continents.length; i++) {
    let continentName = continents[i].continentName
    let countries = continents[i].countries

    console.log(`\n`)
    console.log(`console.log('${continentName}')`)

    // country
    for(j = 0; j < countries.length; j++) {

      index++

      // from
      if(index < start) {
        continue
      }

      // to
      if(index > end) {
        break outer
      }

      console.log(`console.log(\`start: ${start}, len: ${++len}\`)`)
      let name = countries[j].countryName
      let url = countries[j].url
      console.log(`// await handle('${name}', '${url}')`)
    }

    
    
  }

  console.log(`\n\n}\n\n`)
  console.log(`main()`)
  console.log(`\n\n`)

})


