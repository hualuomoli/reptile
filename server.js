var request = require('request')
var mysql = require('mysql')

var tool = require('./tool')
var global = require('./global')


function getConnection(){
  return mysql.createConnection({
    host     : global.config.mysql.ip,
    user     : global.config.mysql.username,
    password : global.config.mysql.password,
    database : global.config.mysql.database
  });
}

/**
 * 清空
 */
function clean() {
  return new Promise((resolve, reject) => {
     let connection = getConnection()
     connection.connect()

     let sql = 'DELETE FROM t_global_ip'
     let params = []
     connection.query(sql, params, function(err, result) {
        if(err) {
          reject(err)
          return
        }

        resolve(result)
     })
   })
     
}     

/**
 * 保存IP地址
 * @param provinceName 省份名称
 * @param cityName 城市名称
 * @param ips IP地址
 */
function save(provinceName, cityName, ips) {
  return new Promise((resolve, reject) => {
     let connection = getConnection()
     connection.connect()

     let sql = 'INSERT INTO t_global_ip(province_name, city_name, start_str, end_str, start_num, end_num, description) VALUES(?, ?, ?, ?, ?, ?, ?)'
     for(let i = 0; i < ips.length; i++) {
       let ip = ips[i]
       let params = [provinceName, cityName, ip.start, ip.end, toNumber(ip.start), toNumber(ip.end), ip.description]
       connection.query(sql, params, function(err, result) {
          if(err) {
            reject(err)
            return
          }

          resolve(result)
       })
     }
     
  })

}

function toNumber(ip) {
  let array = ip.split(".")
  let str = tool.leftPad(array[0], 3, '0')
          + tool.leftPad(array[1], 3, '0')
          + tool.leftPad(array[2], 3, '0')
          + tool.leftPad(array[3], 3, '0')
  return parseInt(str)
}

module.exports = {
  save: save,
  clean: clean
}



save('山东', '青岛市', [{"start": "10.1.91.0", "end": "10.1.91.255", "description": "山东青岛"}])
.then(console.log)

