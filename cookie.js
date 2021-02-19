const fs      = require('fs')
const path    = require('path')

const cookie_filename = '.cookie.tmp'

// 暂停
const run = async(cookie) => {
  return new Promise((resolve, reject) => {
    let file = path.resolve(__dirname, cookie_filename)
    let options = {encoding: 'UTF-8'}
    
    fs.writeFile(file, cookie, options, err => {
      
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


const cookie = '__gads=ID=a70ca82f9c658892-229a3a0cc0c50023:T=1610951137:RT=1610951137:S=ALNI_MbwDZ4bfZo0DiXIK14WPA74OqxfVg; .ASPXAUTH=8627E905FF9CD8D29F54B1A5DE28BFAF0C5FF2E089BF2BAC46882CFE8506B13138FDB4793804C5CBB5B217BA3485FEFE92C67F32D99597BF7C9C868EB5F798319B8950E9F6B313EFC696CB5299A67C7EB6657BB6C9A94D31D87035FF59242E2872A73D4A2CD8A6930EDC8985; Hm_lvt_b81c736a1ec124f39d83f7a0ef3c31aa=1611555601,1612323114,1612683258,1613694334; ASP.NET_SessionId=husbebqcqcxzukk4lgtvjlwa; Hm_lpvt_b81c736a1ec124f39d83f7a0ef3c31aa=1613697284'

run(cookie)