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
  })
}

/**
 * 清空
 */
const clean = async() => {

  let sql = 'DELETE FROM t_ip_address'
  let params = []

  return new Promise((resolve, reject) => {
    let connection = getConnection()
    connection.connect()
    connection.query(sql, params, function(err, result) {
      connection.end()

      if(err) {
        reject(err)
        return
      }

      resolve(result)
    })
   })
     
}     


/**
 * 保存一条IP数据
 * @param id 数据的ID
 * @param ip IP信息
 * @param connection 数据库连接
 */
const saveOne = async(id, ip, connection) => {
  let sql = 'INSERT INTO t_ip_address(id, country_name, province_name, city_name, start_str, end_str, start_num, end_num, description) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
  let params = [id, ip.countryName, ip.provinceName, ip.cityName, ip.start, ip.end, toNumber(ip.start), toNumber(ip.end), ip.description]

  return new Promise((resolve, reject) => {
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
 * @param ips IP地址
 */
const save = async(ips) => {

  if(ips.length == 0) {
    return
  }

  // 前缀
  let prefix = ips[0].countryName + "_" + ips[0].provinceName + "_" + ips[0].cityName

  // 连接
  let connection = getConnection()
  connection.connect()

  let id
  let ip
  for(let i = 0; i < ips.length; i++) {
    id = prefix + tool.leftPad((i + 1).toString(), 3, '0')
    ip = ips[i]
    await saveOne(id, ip, connection)
  }
   
   connection.end()

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





