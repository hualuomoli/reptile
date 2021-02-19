const logger = require('../../assets/logger')

const run = async() => {

  logger.init(logger.config.INFO)

  // log
  logger.log()
  logger.log('jack')
  logger.log('hello', 'jack')
  logger.log('hello', 'jack', '!')
  logger.log('hello', 'jack', '!', 'Bingo')

  // trace
  logger.trace('trace message')

  // debug
  logger.debug('debug message')

  // info
  logger.info('info message')

  // warn
  logger.warn('warn message')

  // error
  logger.error('error message')

}


run()

