const tool = require('../../assets/tool')


const run = async() => {

  // sleep
  let millis = 2000
  // console.log('sleep...') & await tool.sleep(millis).then(res => console.log(`sleep ${millis} millis`))

  // left pad
  // console.log(tool.leftPad('500', 8, '0'))

  // right pad
  // console.log(tool.rightPad('2.01', 8, '0'))

  // retry
  const retryFn = async(x, y) => {
    if(Math.random() >= 0.3) {
      return Promise.reject('fail')
    }

    let result = x + y
    return Promise.resolve(`result: ${result}`)
  }

  const retryFnExports = async() => {
    return tool.retry(retryFn, arguments)
  }

  await retryFnExports(1, 2).then(console.log).catch(console.error)
}

run()