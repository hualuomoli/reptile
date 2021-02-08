
const config = {
  mysql: {
    ip: 'localhost',
    username: 'reptile',
    password: 'reptile',
    database: 'reptile'
  },
  retryTimes: 5,
  waitMillis: 5000,
  tryByUrl: false
}

module.exports = {
  config: config
}