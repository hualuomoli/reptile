var parser = require('./assets/parser')
var server = require('./assets/server')
var tool = require('./assets/tool')

var china = require('./china')


china.loadAddresses()
.then(provinces => {
  
  console.log(`var server = require('./assets/server')`)
  console.log(`var parser = require('./assets/parser')`)
  console.log(`\n`)

  console.log(`
const handle = async(countryName, provinceName, cityName, cityUrl) => {
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
  // province
  for(let i = 0; i < provinces.length; i++) {
    let provinceName = provinces[i].provinceName
    let cities = provinces[i].cities

    console.log(`\n`)
    console.log(`// ${provinceName}`)
    console.log(`// await server.clean('${countryName}', '${provinceName}')`)

    // city
    for(j = 0; j < cities.length; j++) {
      let cityName = cities[j].cityName
      let cityUrl = cities[j].url
      console.log(`// await handle('${countryName}', '${provinceName}', '${cityName}', '${cityUrl}')`)
    }

    
    
  }

  console.log(`\n\n}\n\n`)
  console.log(`main()`)
  console.log(`\n\n`)

})








