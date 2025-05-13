//导入并使用express框架
const express = require('express')
const app = express()

//导入表格工具
const bodyParser = require('body-parser')

//导入并挂载cors解决跨域
const cors = require('cors')
app.use(cors())

//当extended为false时表示值为数组或字符串、true时为任意类型
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const loginRouter = require('./router/login')
app.use('/api',loginRouter)

//设置后端接口为3007并进行监听
app.listen(3007, () => {
	console.log('hello,this is http:127.0.0.1:3007')
})