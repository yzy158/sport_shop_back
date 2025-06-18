//导入express框架
const express = require('express')

//使用express框架里的路由方法
const router = express.Router()

//导入expressjoi
const expressJoi = require('@escook/express-joi')

//导入处理登录与注册的路由处理模块
const userinfoHandle = require('../router_handle/userinfo')

//导入验证规则
const {
	name_limit,
	email_limit,
	password_limit,
	forgetPassword_limit
} = require('../limit/user.js')

//上传头像
router.post('/uploadAvatar',userinfoHandle.uploadAvatar)

//绑定账号
router.post('/bindAccount',userinfoHandle.bindAccount)

//修改用户密码
router.post('/changePassword',expressJoi(password_limit),userinfoHandle.changePassword)

//获取用户信息
router.post('/getUserInfo',userinfoHandle.getUserInfo)

//修改用户姓名
router.post('/changeUserName',expressJoi(name_limit),userinfoHandle.changeUserName)

//修改用户性别
router.post('/changeUserSex',userinfoHandle.changeUserSex)

//修改用户邮箱
router.post('/changeUserEmail',expressJoi(email_limit),userinfoHandle.changeUserEmail)

//验证账户与邮箱
router.post('/verifyAccountAndEmail',userinfoHandle.verifyAccountAndEmail)

//登录页面忘记密码
router.post('/changePasswordInLogin',expressJoi(forgetPassword_limit),userinfoHandle.changePasswordInLogin)

//暴露路由
module.exports = router