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

//用户管理部分
//新增管理员
router.post('/createAdmin',userinfoHandle.createAdmin)

//获取管理员列表
router.post('/getAdminList',userinfoHandle.getAdminList)

//编辑管理员信息
router.post('/editAdmin',userinfoHandle.editAdmin)

//降级管理员账号
router.post('/changeIdentityToUser',userinfoHandle.changeIdentityToUser)

//升级用户账号
router.post('/changeIdentityToAdmin',userinfoHandle.changeIdentityToAdmin)

//搜索用户
router.post('/searchUser',userinfoHandle.searchUser)

//根据部门搜索用户
router.post('/searchUserByDepartment',userinfoHandle.searchUserByDepartment)

//冻结用户账号
router.post('/banUser',userinfoHandle.banUser)

//解冻用户账号
router.post('/hotUser',userinfoHandle.hotUser)

//获取冻结用户列表
router.post('/getBanList',userinfoHandle.getBanList)

//删除用户
router.post('/deleteUser',userinfoHandle.deleteUser)

//获取对应身份的一个总人数
router.post('/getAdminListLength',userinfoHandle.getAdminListLength)

//监听换页返回数据
router.post('/returnListData',userinfoHandle.returnListData)

//暴露路由
module.exports = router