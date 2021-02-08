

/**
 * 休眠等待
 * @param millis 休眠毫秒数
 * @return Promise
 */
const sleep = async(millis = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(function(){
      resolve()
    }, millis)
  })
}

/**
 * 左填充
 * @param str 被填充的字符串
 * @param len 总长度
 * @param padding 填充字符
 * @result 填充后的字符
 */
const leftPad = function(str, len, padding) {
  let length = str.length
  if(length >= len) {
    return str
  }

  let result = str
  let count = len - length
  for(let i = 0; i < count; i++) {
    result = padding + result
  }

  return result
}

/**
 * 右填充
 * @param str 被填充的字符串
 * @param len 总长度
 * @param padding 填充字符
 * @result 填充后的字符
 */
const rightPad = function(str, len, padding) {
  let length = str.length
  if(length >= len) {
    return str
  }

  let result = str
  let count = len - length
  for(let i = 0; i < count; i++) {
    result = result + padding
  }

  return result
}

module.exports = {
  sleep: sleep,
  leftPad: leftPad,
  rightPad: rightPad
}

