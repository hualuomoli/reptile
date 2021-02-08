const http   = require('../../assets/http')
const curl   = require('../../assets/curl')
const parser = require('../../service/parser')


const cookie = '__gads=ID=a70ca82f9c658892-229a3a0cc0c50023:T=1610951137:RT=1610951137:S=ALNI_MbwDZ4bfZo0DiXIK14WPA74OqxfVg; .ASPXAUTH=8627E905FF9CD8D29F54B1A5DE28BFAF0C5FF2E089BF2BAC46882CFE8506B13138FDB4793804C5CBB5B217BA3485FEFE92C67F32D99597BF7C9C868EB5F798319B8950E9F6B313EFC696CB5299A67C7EB6657BB6C9A94D31D87035FF59242E2872A73D4A2CD8A6930EDC8985; ASP.NET_SessionId=3cf4ljuildtsbcbcy5him4n3; Hm_lvt_b81c736a1ec124f39d83f7a0ef3c31aa=1611126430,1611555601,1612323114,1612683258; Hm_lpvt_b81c736a1ec124f39d83f7a0ef3c31aa=1612683286'

function toString(array) {
  let count = array.length

  if(count == 0) {
    return `empty array`
  }

  let item = array[0]
  return `count: ${count}, first: ${JSON.stringify(item)}`
}

const run = async() => {

  curl.init(cookie)
  http.init(cookie)

  // load by url
  await parser.loadByUrl('http://ip.yqie.com/cn/shandong/qingdao/').then(datas => console.log(toString(datas)))

  // load by name
  await parser.loadByName('青岛市').then(datas => console.log(toString(datas)))

}


run()
