//导入mysql数据库
const mysql = require('mysql')

//连接数据库
const db = mysql.createPool({
	host:'localhost',
	user:'sport_shop',
	password:'123456',
	database:'sport_shop'
})

//将数据库暴露出去
module.exports = db