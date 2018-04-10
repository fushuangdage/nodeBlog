var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/User');
var Content =require('../models/Content')

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

/*
 * ajax注册路由，接口数据返回
 */
router.post('/user/register', urlencoded, function (req, res, next) {
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


/*
 * ajax登陆路由，接口数据返回
 */
router.post('/user/login',urlencoded,function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    if (username==''||password==''){
        responseData.message="用户名和密码不能为空"
        responseData.code=1;
        res.json(responseData)
        return
    }

    //查询数据库相同用户名和密码的记录是否存在
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code=2
            responseData.message='用户名和密码错误'
            res.json(responseData)
            return
        }else {
            responseData.message='登陆成功'
            responseData.code=0
            res.cookies.set('userInfo',JSON.stringify({
                _id:userInfo._id,
                username:userInfo.username,
                isAdmin:userInfo.isAdmin
            }));
            res.json(responseData)
        }
    })

})

router.get('/user/exit',function (req, res) {
    req.cookies.set('userInfo',null)
    responseData.code=0
    responseData.message="已退出"
    res.json(responseData)
})


router.post('/comments/post',function (req, res) {
    var articleId=req.body.articleId||'';
   console.log(articleId+"fffffffff")

    var postData={
        username:req.userInfo.username,
        addTime:new Date(),
        content:req.body.content,
    };
    Content.findOne({
        _id:articleId
    }).then(function (content) {
        content.comments.push(postData)
        return content.save();
    }).then(function (value) {
        responseData.message="评论成功";
        responseData.data=value;
        res.json(responseData);
    })
});


module.exports = router;