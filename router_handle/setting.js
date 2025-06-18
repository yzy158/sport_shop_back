const db = require('../db/index')

//上传轮播图的接口 需要两个参数 set_name,set_value
exports.uploadSwiper = (req,res) => {

	let oldName = req.files[0].filename
	let newName = Buffer.from(req.files[0].originalname,'latin1').toString('utf8')
	fs.renameSync('./public/upload/'+ oldName,'./public/upload/'+  newName)
	const sql = 'update setting set set_value = ? where set_name = ?'
	db.query(sql,[`http://127.0.0.1:3007/upload/${newName}`, req.body.name],(err,result) => {
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:'上传轮播图成功'
		})
	})
}

//获取所有轮播图的接口
exports.getAllSwiper = (req,res) => {
	const sql = "select * from setting where set_name like 'swiper%' "
	db.query(sql,(err,result) => {
		if(err) return res.cc(err)
		//创建一个数组去存放所有轮播图
		let array = []
		result.forEach((e)=>{
			array.push(e.set_value)
		})
		res.send({
			array
		})
	})
}

//获取公司名称的接口
exports.getCompanyName = (req,res) => {
	const sql = "select * from setting where set_name = '公司名称' "
	db.query(sql,(err,result) => {
		if(err) return res.cc(err)
		res.send(result[0].set_value)
	})
}

//修改公司名称的接口
exports.changeCompanyName = (req,res) => {
	const sql = 'update setting set set_value = ? where set_name = "公司名称" '
	db.query(sql,req.body.set_value,(err,result) => {
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:'修改公司名称成功'
		})
	})
}

//获取公司介绍的接口
exports.getCompanyIntroduce = (req,res) => {
	const sql = "select * from setting where set_name = ? "
	db.query(sql,req.body.set_name,(err,result) => {
		if(err) return res.cc(err)
		res.send(result[0].set_text)
	})
}

//编辑公司介绍的接口，参数set_text,set_name
exports.changeCompanyIntroduce = (req,res) => {
	const sql = 'update setting set set_text = ? where set_name = ? '
	db.query(sql,[req.body.set_text,req.body.set_name],(err,result) => {
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:'修改公司介绍成功'
		})
	})
}

//获取所有跟公司有关的信息
exports.getAllCompanyInfo = (req,res) => {
	const sql = "select * from setting where set_name like '公司%' "
	db.query(sql,(err,result) => {
		if(err) return res.cc(err)
		res.send(result)
	})
}