//导入mysql数据库
const mysql = require('mysql2')

//连接数据库
const db = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'sport_shop'
})

//将数据库暴露出去
module.exports = db