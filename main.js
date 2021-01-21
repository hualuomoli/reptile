var parser = require('./parser')
var server = require('./server')
var tool = require('./tool')



parser.loadAddresses('中国')
.then(addresses => {
  
  console.log(`var server = require('./server')`)
  console.log(`var parser = require('./parser')`)
  console.log(`\n\n\n\n`)

  let countryName = addresses.countryName

  // province
  let provinces = addresses.provinces
  for(let i = 0; i < provinces.length; i++) {
    let provinceName = provinces[i].provinceName
    let cities = provinces[i].cities

    // city
    let cityNames = []
    for(j = 0; j < cities.length; j++) {
      let cityName = cities[j].cityName
      tool.array.add(cityName, cityNames)
    }

    console.log(`// ${provinceName}`)
    console.log(`// server.clean('${countryName}', '${provinceName}').then(parser.loadProvince('${countryName}', '${provinceName}', ${JSON.stringify(cityNames)}))`)
    console.log(``)
  }

})






