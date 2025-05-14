const db = require('../db/index')
//导入bcrypt加密中间件
const bcrypt = require('bcrypt')
//导入jwt，用于生产token
const jwt = require('jsonwebtoken')
//导入jwt配置文件、用于加密和解密token
const jwtconfig = require('../jwt_config/index.js')

exports.register = (req,res) => {
	//req是前端传递过来的参数,res是后端要返回给前端的数据
	const reginfo = req.body
	//第一步、判断前端传递过来的数据是否为空
	if(!reginfo.account || !reginfo.password){
		return res.send({
			status:1,
			message:'账号或密码不能为空'
		})
	}
	//第二步、判断前端传递过来的账号是否已经存在数据库里面
	//使用mysql的select语句
	const sqls = 'select * from users where account = ?'
	//第一个参数是sql查询语句、第二个是传入的账号、第三个是用于处理结果的回调函数
	db.query(sqls,reginfo.account,(err,results)=>{
		if(results.length>0){
			return res.send({
				status:1,
				message:'账号已存在'
			})
		}
		//第三步、如果账号不存在，使用bcrypt.js对密码进行加密
		//bcrypt.hashSync第一个参数是传入的密码，第二个参数是加密后的长度
		reginfo.password = bcrypt.hashSync(reginfo.password,10)
		//第四步、将账号和密码传入到users表中
		const sqli = 'insert into users set ?'
		//注册身份
		const identity = '用户'
		//创建时间
		const create_time = new Date()
		db.query(sqli,{
			account:reginfo.account,
			password:reginfo.password,
			//身份
			identity,
			//创建时间
			create_time,
			//初始未冻结状态为0
			status:0,
		},(err,results)=>{
			//1，插入失败的情况
			//affectedRows为影响的行数，如果插入失败，就是没有影响到行数、也就是行数不为1
			if(results.affectedRows !== 1){
				return res.send({
					status:1,
					message:'注册账号失败'
				})
			}
			res.send({
				status:0,
				message:'注册账号成功'
			})
		})
	})
}

exports.login = (req,res) => {
	const loginfo = req.body
	//第一步、查看数据库中有没有前端传递过来的账号
	const sql = 'select * from users where account = ?'
	db.query(sql,loginfo.account,(err,results)=>{
		//执行sql语句失败的情况，一般是数据库端口会出现失败
		if(err) return res.cc(err)
		if(results.length !== 1) return res.cc('数据库无此账号，登录失败')
		//第二步、对前端传递过来的密码进行解密
		const compareRes = bcrypt.compareSync(loginfo.password,results[0].password)
		if(!compareRes){
			return res.cc('密码不正确，登录失败')
		}
		//第三步、对该账号是否冻结做判断
		if(results[0].status == 1){
			return res.cc('该账号已被冻结')
		}
		//第四步、生成返回给前端的token
		//剔除加密后的密码、头像、创建时间、更新时间
		const user = {
			...results[0],
			password:'',
			imageUrl:'',
			create_time:'',
			update_time:'',
		}
		//设置token的有效时长，为1小时
		const tokenStr = jwt.sign(user,jwtconfig.jwtSecretKey,{
			expiresIn:'1h'
		})
		res.send({
			result:results[0],
			status:0,
			message:'登录成功',
			token:'Bearer ' + tokenStr 
		})
	})
}