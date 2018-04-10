var express = require('express');
var Catetory = require('../models/Category')
var Content = require('../models/Content');
var router = express.Router();

var TAG = "main.js";


/**
 * 处理通用数据
 */
var data;

router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,

    }
    next()
})

router.get('/', function (req, res, next) {

    var categoryID = req.query.category || '';


    Catetory.find().then(function (categories) {

        data.page = Number(req.query.page || 1)
        data.limit = 2
        data.pages = 0
        data.categories = categories
        data.category = req.query.category || ''
        var where = {};
        if (data.category) {
            where.category = data.category;
        }

        Content.where(where).find().then(function (content) {

            return Content.where(where).count();
        }).then(function (count) {
            data.pages = Math.ceil(count / data.limit)
            data.page = Math.min(data.page, data.pages)
            data.page = Math.max(data.page, 1)

            var skip = (data.page - 1) * data.limit
            return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
                addTime: -1
            })
        }).then(function (contents) {
            data.contents = contents
            console.log(data)
            console.log(categories)
            res.render("main/index", data)
        })
    });
});

router.get('/article_detail', function (req, res, next) {
    var contentId = req.query.content_id || '';

    console.log("++++++" + contentId)

    Content.findOne({
        _id: contentId
    }).populate(['category', 'user']).then(function (content) {
        data.content=content;
        content.views++;

        var html='';
        for (var i = 0; i < content.comments.length; i++) {
            html+='<div class="messageBox">' +
                '            <span>'+content.comments[i].username+'</span>\n' +
                '            <span class="gravity_right">'+content.comments[i].addTime+'</span>\n' +
                '            <P>'+content.comments[i].content+'</P>' +
                '        </div>';
        }
        // $('#messageList').html(html)
        content.save();
        res.render("main/article_detail",data);
    })

})


module.exports = router