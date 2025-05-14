//登录注册模块的路由
//导入express框架
const express = require('express')

//使用express框架里的路由方法
const router = express.Router()

//导入处理登录与注册的路由处理模块
const loginHandle = require('../router_handle/login')

//导入expressjoi
const expressJoi = require('@escook/express-joi')
//导入验证规则
const {
	login_limit
} = require('../limit/login.js')

//注册
router.post('/register',expressJoi(login_limit),loginHandle.register)
//登录
router.post('/login',expressJoi(login_limit),loginHandle.login)

//暴露路由
module.exports = router