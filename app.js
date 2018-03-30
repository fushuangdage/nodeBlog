/*
 应用程序的启动入口文件
 */

//加载express模块
var express = require('express');
var swig=require('swig')
var mongoose = require("mongoose");

//加载bodyParser,用于处理post提交过来的数据
var bodyParser = require('body-parser');

var app = express(); //=>等同意NodeJs中的Server


//设置静态文件托管
app.use('/public',express.static(__dirname+'/public'));
//根据不同对功能划分模块
app.use('/admin',require('./routers/admin'))
app.use('/api',require('./routers/api'))
app.use('/',require('./routers/main'))

//

app.engine('html',swig.renderFile)  //第一个参数
app.set('views','./views')          //配置模版文件的存放目录
app.set('view engine','html')       //注册所使用的模版引擎



mongoose.connect('mongodb://localhost:27017/blog',function (err) {
    if (err) {
        console.log('数据库链接失败')
    }else {
        console.log('数据库链接成功')
    }
})


swig.setDefaults({cache:false})


//设置bodyParser
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.text({type: 'text/html'}))


app.listen(8080);