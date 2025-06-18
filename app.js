//导入并使用express框架
const express = require('express')
const app = express()

//导入表格工具
const bodyParser = require('body-parser')

//导入并挂载cors解决跨域
const cors = require('cors')
app.use(cors())

//Multer是一个nodejs中间件，用于处理multipart/form-data类型的表单数据，主要用于上传文件
const multer = require('multer')
//在server服务器端新建一个public文件。在public文件下新建upload文件用于存放数据
const upload = multer({dest:'./public/upload'})

app.use(upload.any())
//静态托管
app.use(express.static('./public')) 

//当extended为false时表示值为数组或字符串、true时为任意类型
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//注册全局错误中间件
app.use((req,res,next)=>{
	//status = 0为成功，status = 1为失败、默认status = 0 好处理失败的情况
	res.cc = (err,status = 1)=>{
		res.send({
			status,
			//判断这个error是对象还是字符串
			message:err instanceof Error ? err.message : err,
		})
	}
	next()
})

const jwtconfig = require('./jwt_config/index.js')
const {expressjwt:jwt} = require('express-jwt')
// app.use(jwt({
// 	secret:jwtconfig.jwtSecretKey,algorithms:['HS256']
// }).unless({
// 	//除了注册与登录之外都要用到token验证
// 	path:[/^\/api\//],
// }))

const loginRouter = require('./router/login')
const Joi = require('joi')
app.use('/api',loginRouter)

const userRouter = require('./router/userinfo')
app.use('/user',userRouter)

const setRouter = require('./router/setting')
app.use('/set',setRouter)

//对不符合joi规则的情况进行报错
app.use((req,res,next) => {
	if(err instanceof Joi.ValidationError) return res.cc(err)
})

//设置后端接口为3007并进行监听
app.listen(3007, () => {
	console.log('hello,this is http:127.0.0.1:3007')
})