
const config = {
  COOKIE: '__gads=ID=a70ca82f9c658892-229a3a0cc0c50023:T=1610951137:RT=1610951137:S=ALNI_MbwDZ4bfZo0DiXIK14WPA74OqxfVg; .ASPXAUTH=8627E905FF9CD8D29F54B1A5DE28BFAF0C5FF2E089BF2BAC46882CFE8506B13138FDB4793804C5CBB5B217BA3485FEFE92C67F32D99597BF7C9C868EB5F798319B8950E9F6B313EFC696CB5299A67C7EB6657BB6C9A94D31D87035FF59242E2872A73D4A2CD8A6930EDC8985; ASP.NET_SessionId=ry3vgylf0arqhyq3wgkmgkqt; Hm_lvt_b81c736a1ec124f39d83f7a0ef3c31aa=1610951234,1610951432,1611019537,1611126430; Hm_lpvt_b81c736a1ec124f39d83f7a0ef3c31aa=1611284483'
  , mysql: {
    ip: 'localhost',
    username: 'reptile',
    password: 'reptile',
    database: 'reptile'
  }
  , proxy: {
    enable: false,
    address: ''
  },
  retryTimes: 5,
  waitMillis: 5000,
  tryByUrl: false
}

module.exports = {
  config: config
}