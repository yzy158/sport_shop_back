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
		result[0].password = '用户密码不可见'
		res.send(result[0])
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

//用户管理部分
exports.createAdmin = (req,res) => {
	const {
		account,
		password,
		name,
		sex,
		department,
		email,
		identity
	} = req.body
	//判断账号是否存在于数据库中
	const sql = 'select * from users where account = ?'
	db.query(sql, account, (req, results) => {
		//判断账号是否存在
		if(results.length > 0){
			return res.send({
				status:1,
				message:'账号已存在'
			})
		}
		const hashpassword = bcrypt.hashSync(password,10)
		//将账号和密码插入到users表中
		const sql1 = 'insert into users set ?'
		//创建时间
		const create_time = new Date()
		db.query(sql1, {
			account,
			password:hashpassword,
			name,
			sex,
			department,
			email,
			identity,
			create_time,
			status: 0,
		},(err, results) => {
			if (results.affectedRows !== 1){
				return res.send({
					status: 1,
					message: '添加管理员失败'
				})
			}
			res.send({
				status: 0,
				message: '添加管理员成功'
			})
		})
	})
}

//获取管理员列表，参数是identity
exports.getAdminList = (req, res) => {
	const sql = 'select * from users where identity = ? '
	db.query(sql, req.body.identity, (err, result) => {
		if (err) return res.cc(err)
		result.forEach((e) => {
			e.password = '',
			e.create_time = ''
			e.image_url = ''
			e.status = ''
		})
		res.send(result)
	})
}

//编辑管理员账号
exports.editAdmin = (req, res) => {
	const {
		id,
		name,
		sex,
		email,
		department
	} = req.body
	const date = new Date()
	//修改内容
	const updateContent = {
		id,
		name,
		sex,
		email,
		department,
		update_time:date,
	}
	const sql = 'update users set ? where id = ?'
	db.query(sql, [updateContent, updateContent.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '修改管理员信息成功'
		})
	})
}

//降级管理员账号
exports.changeIdentityToUser = (req, res) => {
	const identity = '用户'
	const sql = 'update users set identity = ? where id = ? '
	db.query(sql, [identity, req.body.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '降级成功'
		})
	})
}

//升级用户账号
exports.changeIdentityToAdmin = (req, res) => {
	const sql = 'update users set identity = ? where id = ? '
	db.query(sql, [req.body.identity, req.body.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '升级成功'
		})
	})
}

//根据账号进行用户搜索 account
exports.searchUser = (req, res) => {
	const sql = 'select * from users where account = ? '
	db.query(sql, req.body.account, (err, result) => {
		if (err) return res.cc(err)
		result.forEach((e) => {
			e.password = '',
			e.create_time = ''
			e.image_url = ''
			e.status = ''
		})
		res.send(result)
	})
}

//根据部门进行用户搜索 department
exports.searchUserByDepartment = (req, res) => {
	const sql = 'select * from users where department = ? '
	db.query(sql, req.body.department, (err, result) => {
		if (err) return res.cc(err)
		result.forEach((e) => {
			e.password = '',
			e.create_time = ''
			e.image_url = ''
			e.status = ''
		})
		res.send(result)
	})
}

//冻结用户
exports.banUser = (req, res) => {
	const status = 1
	const sql = 'update users set status = ? where id = ? '
	db.query(sql, [status, req.body.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '账号冻结成功'
		})
	})
}

//解冻用户
exports.hotUser = (req, res) => {
	const status = 0
	const sql = 'update users set status = ? where id = ? '
	db.query(sql, [status, req.body.id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '账号解冻成功'
		})
	})
}

//获取冻结用户列表
exports.getBanList = (req, res) => {
	const sql = 'select * from users where status = 1 '
	db.query(sql, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}

//删除用户 id
exports.deleteUser = (req, res) => {
	const sql = 'delete from users where id = ? '
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		const sql1 = 'delete from image where account = ?'
		db.query(sql1, req.body.id, (err, result) => {
			if (err) return res.cc(err)
			res.send({
				status: 0,
				message: '账号已从数据库中删除'
			})
		})
	})
}

// 获取对应身份的一个总人数 identity
exports.getAdminListLength = (req, res) => {
	const sql = 'select * from users where identity = ? '
	db.query(sql, req.body.identity, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			length: result.length
		})
	})
}

// 监听换页返回数据 页码 pager identity
exports.returnListData = (req, res) => {
	// const number = req.body.pager
	const sql = `select * from users where identity = ? limit 1 offset ${req.body.pager}`
	db.query(sql, req.body.identity, (err, result) => {
		if (err) return res.cc(err)
		res.send(result)
	})
}