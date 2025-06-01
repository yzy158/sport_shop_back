const db = require('../db/index')
//导入bcrypt加密中间件
const bcrypt = require('bcrypt')
//导入nodejs的crypto库生成uuid
const crypto = require('crypto')
//导入fs处理文件路径
fs = require('fs')

//上传头像的接口
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

//绑定账号与头像、接受onlyid,account,url
exports.bindAccount = (req,res) => {
	const {account,onlyId,url} = req.body
	const sql = 'update image set account = ? where onlyId = ?'
	db.query(sql,[account,onlyId],(err,result) => {
		if(err) return res.cc(err)
		if(result.affectedRows == 1){
			const sql1 = 'update users set image_url = ? where account = ?'
			db.query(sql1,[url,account],(err,result) => {
				if(err) return res.cc(err)
				res.send({
					status:0,
					message:'修改成功'
				})
			})
		}
	})
}

//根据用户id获取用户个人信息
exports.getUserInfo = (req,res) => {
	const sql = 'select * from users where id = ?'
	db.query(sql,req.body.id,(err,result) => {
		if(err) return res.cc(err)
		res.send(result)
	})
}

//修改用户密码，先输入旧密码oldpassword，新密码newpassword id
exports.changePassword = (req,res) => {
	const sql = 'select password from users where id = ?'
	db.query(sql, req.body.id, (err,result) => {
		if(err) return res.cc(err)
		const compareResult = bcrypt.compareSync(req.body.oldPassword,result[0].password)
		if(!compareResult){
			res.send({
				status:1,
				message:'原密码错误'
			})
		}
		req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 10)
		const sql1 = 'update users set password = ? where id = ?'
		db.query(sql1, [req.body.newPassword, req.body.id], (err,result)=>{
			if(err) return res.cc(err)
			res.send({
				status:0,
				message:'修改密码成功'
			})
		})
	})
}

//验证账户与邮箱是否一致 email account
exports.verifyAccountAndEmail = (req,res) => {
	const { account,email } = req.body
	const sql = 'select * from users where account = ?'
	db.query(sql, account, (err, result) => {
		if(err) return res.cc(err)
		if (!result || result.length === 0) {
		  return res.status(404).send("用户不存在"); // 返回 404 或自定义错误
		}
		if(email == result[0].email){
			res.send({
				status:0,
				message:'成功查询到邮箱',
				id:result[0].id
			})
		}else{
			res.send({
				status:1,
				message:'查询邮箱失败'
			})
		}
	})
}

//修改用户的姓名
exports.changeUserName = (req,res) => {
	const { id,name } = req.body
	const sql = 'update users set name = ? where id = ?'
	db.query(sql,[name,id],(err,result) => {
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:'修改成功'
		})
	})
}

//修改用户的性别
exports.changeUserSex = (req,res) => {
	const { id,sex } = req.body
	const sql = 'update users set sex = ? where id = ?'
	db.query(sql,[sex,id],(err,result) => {
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:'修改成功'
		})
	})
}


//修改用户的邮箱
exports.changeUserEmail = (req,res) => {
	const { id,email } = req.body
	const sql = 'update users set email = ? where id = ?'
	db.query(sql,[email,id],(err,result) => {
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:'修改成功'
		})
	})
}

//登录页面忘记密码 newPassword id
exports.changePasswordInLogin = (req,res) => {
	const user = req.body
	user.newPassword = bcrypt.hashSync(user.newPassword,10)
	const sql = 'update users set password = ? where id = ?'
	db.query(sql, [user.newPassword, user.id], (err, result) => {
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:'更新密码成功'
		})
	})
}