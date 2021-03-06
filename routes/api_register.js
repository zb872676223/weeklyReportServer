var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var userModel = require("../models/user");
var cookieParser = require("cookie-parser");
// project using chalk for colorful output at terminal
const chalk = require("chalk")
const msgCk = chalk.green
const errCk = chalk.bold.blue
const warnCk = chalk.yellow
const keyCk = chalk.bgRed.white
// connect to mongodb databse
mongoose.connect("mongodb://127.0.0.1:27017/blog");

mongoose.connection.on("connected",()=>{
	console.log(keyCk("load server has connected to mongodb 127.0.0.1:27017"))
})

mongoose.connection.on("error",()=>{
	console.log(errCk("load server has happend an error when connected to mongodb at 127.0.0.1:27017"))
})

mongoose.connection.on("disconnected",()=>{
	console.log(keyCk("load server has disconnected to mongoodb at 127.0.0.1:27017"))
})
// 测试使用的路由	
// router.get("/",(req,res,next)=>{
// 	res.json({
// 		status:"12",
// 		msg:"register success"
// 	})
// 	let testObj={
// 		name:"jyy",
// 		psw:"123456",
// 		works:["lanmu","life","music","fitness"]
// 	}
// 	userModel.create([testObj],(err,doc)=>{
// 		if (err) {
// 			console.log(errCk("has err when create an doc"))
// 		}else{
// 			console.log(msgCk("has create an doc suc"))
// 		}
// 	})
// })	 

router.post("/register",(req,res,next)=>{
	console.log(req.body)
	userModel.create([req.body],(err,doc)=>{
		if (err) {
			console.log(errCk("has happend an err at create an doc at api_register"))
			data.json({"register":"0","msg":"注册失败"})
		}else{
			console.log(msgCk("success create an doc at api_register"))
			res.json({"register":"1","msg":"注册成功"})		
		}
	})
})

router.post("/load",(req,res,next)=>{
	console.log(req.body)
	userModel.findOne(req.body,(err,doc)=>{
		if (err) {
			console.log(errCk("has happend an err at find an doc at api_register"))
			res.json({"result":"0" , "msg":"查找用户信息的过程中发生错误"})
		}else{
			console.log(msgCk("success find an doc at api_register"))
			console.log(doc)
			
			if (doc === null) {
				res.json({"result":"0"})	
			}else{
				// 设置cookie
				res.cookie("userId",doc.id,{
					path:"/",
					maxAge:1000*60*60*24,

				});
				// 设置session
				// req.session.user=doc;
				res.cookie("userName",doc.name,{
					path:"/",
					maxAge:1000*60*60*24,
				});
				// 将数组转化为字符串发送
				// var locWorks = [];
				// doc.works.forEach((item,index,arr)=>{
				// 	locWorks.push({ename:item.ename,cname:item.cname,id:item.id})
				// })

				// console.log("维护的工作时：",doc.works[0]);
				// locWorks = doc.works + " ";
				// console.log(locWorks);
				// console.log(typeof doc.works);
				res.cookie("userWork",doc.works,{
					path:"/",
					maxAge:1000*60*60*24
				})
				res.json({"result":"1"});
			}
		}
	})
})

router.post("/update" , (req , res , next)=>{
	var id = req.body.id;
	userModel.update({id:id},req.body,(err,doc)=>{
		if (err) {
			console.log(errCk("has happend an err at update an doc at api_register"))
			res.json({"result":"0","msg":"更新用户信息数据库发生错误"})
		}else{
			console.log(msgCk("success update an doc at api_register"))
			console.log(doc)
			
			if (doc.n == 0) {
				res.json({"result":"0","msg":"更新用户信息没有对应的记录"})	
			}else{
				res.json({"result":"1","msg":"更细用户信息成功"})	
			}
		}

	})
})

module.exports = router;