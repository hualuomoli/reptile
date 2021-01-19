// https://seofangfa.com/proxy/

const defaultProxyUrl = 'http://58.250.21.56:3128'
const proxyUrl        = 'http://58.220.95.32:10174'

var request      = require('request')
var proxyRequest = require('request').defaults({
    proxy: defaultProxyUrl,
    rejectUnauthorized: false,
});


const url = 'http://120.53.235.136:9091/client/ip'


// no proxy
request(url, (err, res, body) => {
  console.log(`no proxy server ${body}`)
})

// proxy request
proxyRequest(url, (err, res, body) => {
  console.log(`default proxy server ${body}`)
})

// configure proxy address
request({
  url: url,
  proxy: proxyUrl,
  rejectUnauthorized: false,
}, (err, res, body) => {
  console.log(`configure proxy server ${body}`)
})

