//导入mysql数据库
const mysql = require('mysql2')

//连接数据库
const db = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'sport_shop'
})

// 测试数据库连接
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ 数据库连接失败：', err.message)
  } else {
    console.log('✅ 数据库连接成功！')
    connection.release() // 释放连接
  }
})

//将数据库暴露出去
module.exports = db