//登录注册模块的路由
//导入express框架
const express = require('express')

//使用express框架里的路由方法
const router = express.Router()

//导入处理登录与注册的路由处理模块
const loginHandle = require('../router_handle/login')

router.post('/register',loginHandle.register)

router.get('/login',loginHandle.login)

//暴露路由
module.exports = router