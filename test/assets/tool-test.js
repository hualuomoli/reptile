const tool = require('../../assets/tool')


const run = async() => {

  // sleep
  let millis = 2000
  console.log('sleep...') & await tool.sleep(millis).then(res => console.log(`sleep ${millis} millis`))

  // left pad
  console.log(tool.leftPad('500', 8, '0'))

  // right pad
  console.log(tool.rightPad('2.01', 8, '0'))

}

run()