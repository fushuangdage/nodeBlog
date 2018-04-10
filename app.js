/*
 应用程序的启动入口文件
 */

//加载express模块
var express = require('express');
var swig = require('swig')
var mongoose = require("mongoose");

//加载bodyParser,用于处理post提交过来的数据
var bodyParser = require('body-parser');

var Cookies = require('cookies');

var User=require("./models/User") //导入数据库查询模块


var app = express(); //=>等同意NodeJs中的Server

//设置bodyParser
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.text({type: 'text/html'}))

//设置cookie
app.use(function (req, res, next) {

    res.cookies = new Cookies(req, res)
    req.cookies = new Cookies(req, res)


    //解析用户cookies信息
    req.userInfo = {}

    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo=JSON.parse(req.cookies.get('userInfo'))

            //获取当前登陆用户的类型
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin)
            })
        } catch (e) {
        }

    }


    next()
})

//设置静态文件托管
app.use('/public', express.static(__dirname + '/public'));
//根据不同对功能划分模块
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))


app.engine('html', swig.renderFile)  //第一个参数
app.set('views', './views')          //配置模版文件的存放目录
app.set('view engine', 'html')       //注册所使用的模版引擎


mongoose.connect('mongodb://localhost:27017/blog', function (err) {
    if (err) {
        console.log('数据库链接失败')
    } else {
        console.log('数据库链接成功')
    }
})


swig.setDefaults({cache: false})


app.listen(8080);