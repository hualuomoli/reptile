

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

const array = {
  addAll: function(origin, target) {
    if(origin.length == 0) {
      return target
    }

    for(let i = 0; i < origin.length; i++) {
      target[target.length] = origin[i]
    }
    return target
  },
  add: function(obj, target) {
    target[target.length] = obj
    return target
  }
}

/**
 * 左填充
 * @param str 被填充的字符串
 * @param len 总长度
 * @param padding 天聪字符
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
 * @param padding 天聪字符
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

/**
 * 移除掉括号
 * @param str
 * @return 移除掉括号后的字符串
 */
const removeBrackets = function(str){
  let index = -1

  if(index == -1) {
    index = str.indexOf('(')
  }
  if(index == -1) {
    index = str.indexOf('（')
  }

  if(index== -1) {
    return str
  }

  return str.substring(0, index)
}

module.exports = {
  sleep: sleep,
  array: array,
  leftPad: leftPad,
  rightPad: rightPad,
  removeBrackets: removeBrackets
}

