const db = require('../db/index')
//导入bcrypt加密中间件
const bcrypt = require('bcrypt')
//导入nodejs的crypto库生成uuid
const crypto = require('crypto')
//导入fs处理文件路径
fs = require('fs')

exports.uploadAvatar = (req,res) => {
	//生成唯一标识
	const onlyId = crypto.randomUUID()
	let oldName = req.files[0].filename
	let newName = Buffer.from(req.files[0].originalname,'latin1').toString('utf8')
	fs.renameSync('./public/upload/'+ oldName,'./public/upload/'+  newName)
	const sql = 'insert into image set ?'
	db.query(sql,{
		image_url:`http://127.0.0.1:3007/upload/${newName}`,
		onlyId
	},(err,result) => {
		if(err) return res.cc(err)
		res.send({
			onlyId,
			status:0,
			url:'http://127.0.0.1:3007/upload/' + newName
		})
	})
}