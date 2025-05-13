const db = require('../db/index.js')

exports.register = (req,res) => {
	res.send('用户进行了注册行为')
}

exports.login = (req, res) => {
  console.log('收到登录请求：', req.body)
  res.send('用户进行了登录行为')
}