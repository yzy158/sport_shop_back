//系统设置模块的路由
//导入express框架
const express = require('express')

//使用express框架里的路由方法
const router = express.Router()

//导入处理登录与注册的路由处理模块
const setHandle = require('../router_handle/setting')

//注册
router.post('/uploadSwiper',setHandle.uploadSwiper)
//获取所有轮播图
router.get('/getAllSwiper',setHandle.getAllSwiper)
//获取公司名称
router.get('/getCompanyName',setHandle.getCompanyName)
//修改公司名称
router.post('/changeCompanyName',setHandle.changeCompanyName)
//获取公司介绍
router.post('/getCompanyIntroduce',setHandle.getCompanyIntroduce)
//编辑公司介绍
router.post('/changeCompanyIntroduce',setHandle.changeCompanyIntroduce)
//获取所有跟公司有关的信息
router.post('/getAllCompanyInfo',setHandle.getAllCompanyInfo)

//暴露路由
module.exports = router