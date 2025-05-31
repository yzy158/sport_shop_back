//导入express框架
const express = require('express')

//使用express框架里的路由方法
const router = express.Router()

//导入expressjoi
const expressJoi = require('@escook/express-joi')

//导入处理登录与注册的路由处理模块
const userinfoHandle = require('../router_handle/userinfo')

//上传头像
router.post('/uploadAvatar',userinfoHandle.uploadAvatar)

//暴露路由
module.exports = router