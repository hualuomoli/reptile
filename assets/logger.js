let formater = require('silly-datetime')


// https://www.jb51.net/article/175494.htm
const CONFIG = {
  LOG: 0,
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5
}

let logger_level = CONFIG.LOG

function init(level) {
  logger_level = level
}

function log() {
  if(logger_level > CONFIG.LOG) {
    return
  }

  let array = [formater.format(new Date(), 'YYYY-MM-dd HH:mm:ss')]
  array.push(...arguments)
  
  console.log(...array)
}

function trace() {
  if(logger_level > CONFIG.TRACE) {
    return
  }
  

  let array = [formater.format(new Date(), 'YYYY-MM-dd HH:mm:ss')]
  array.push('\033[37;40m')
  array.push('[TRACE]')
  array.push(...arguments)
  array.push('\033[0m')
  
  console.log(...array)
}

function debug() {
  if(logger_level > CONFIG.DEBUG) {
    return
  }
  
  let array = [formater.format(new Date(), 'YYYY-MM-dd HH:mm:ss')]
  array.push('\033[34;40m')
  array.push('[DEBUG]')
  array.push(...arguments)
  array.push('\033[0m')
  
  console.log(...array)
}

function info() {
  if(logger_level > CONFIG.INFO) {
    return
  }

  let array = [formater.format(new Date(), 'YYYY-MM-dd HH:mm:ss')]
  array.push('\033[36;40m')
  array.push('[INFO]')
  array.push(...arguments)
  array.push('\033[0m')
  
  console.log(...array)
}

function warn() {
  if(logger_level > CONFIG.WARN) {
    return
  }
  
  let array = [formater.format(new Date(), 'YYYY-MM-dd HH:mm:ss')]
  array.push('\033[33;40m')
  array.push('[WARN]')
  array.push(...arguments)
  array.push('\033[0m')
  
  console.log(...array)
}

function error() {
  if(logger_level > CONFIG.ERROR) {
    return
  }
  
  let array = [formater.format(new Date(), 'YYYY-MM-dd HH:mm:ss')]
  array.push('\033[31;40m')
  array.push('[ERROR]')
  array.push(...arguments)
  array.push('\033[0m')
  
  console.log(...array)
}

module.exports = {
  config: CONFIG,
  init: init,
  log: log,
  trace: trace,
  debug: debug,
  info: info,
  warn: warn,
  error: error
}
