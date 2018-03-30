var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/User');


var router = express.Router();
var urlencoded = bodyParser.urlencoded({extended: false});

var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ""
    }
    next()
});
router.post('/user/register', urlencoded, function (req, res, next) {
    console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空'
        res.json(responseData)
        return
    }
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空'
        res.json(responseData)
        return
    }


    //查询数据库看看是否存在
    User.findOne({
        username: username
    }).then(function (userInfo) {
        console.log(userInfo)
        if (userInfo) {
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = "用户名已经被注册了"
            res.json(responseData)
            return
        } else {
            var user = new User({
                username: username,
                password: password
            });
            user.save().then(function (val) {
                console.log(val)
                responseData.code = 3;
                responseData.message = "注册成功"
                res.json(responseData)
            })
        }
    })

});

module.exports = router