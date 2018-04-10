var express = require('express');

var router = express.Router();

var User = require("../models/User");

var bodyParser = require('body-parser');

var urlencoded = bodyParser.urlencoded({extended: false});

var Category = require("../models/Category");
var Content = require("../models/Content");

router.get('/admin', function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send("对不起，当前只有管理员用户可以进入 ")
        return
    }
    next()
});

router.get("/", function (req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    })

})

router.get("/user_list", function (req, res, next) {

    var page = Number(req.query.page || 1)
    var limit = 2

    var pages = 0   //总页数

    User.count().then(function (count) {

        pages = Math.ceil(count / limit)
        page = Math.min(page, pages)
        page = Math.max(page, 1)

        var skip = (page - 1) * limit

        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_list', {
                userInfo: req.userInfo,
                users: users,
                page: page,
                pages: pages,
                limit: limit,
                count: count
            })
        })
    })
})

router.get("/category_index", function (req, res, next) {
    var page = Number(req.query.page || 1)
    var limit = 2

    var pages = 0   //总页数
    Category.count().then(function (count) {
        pages = Math.ceil(count / limit)
        page = Math.min(page, pages)
        page = Math.max(page, 1)

        var skip = (page - 1) * limit

        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                pages: pages,
                limit: limit,
                count: count
            })
        })
    })
});

router.get("/category_index/add", function (req, res, next) {
    res.render('admin/category_index_add', {})
});

//分类的保存

router.post("/category_index/add", urlencoded, function (req, res, next) {
    var name = req.body.name || ''
    if (name === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "名称不能为空"
        })
        return
    }

    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            res.render("admin/error", {
                userInfo: req.userInfo,
                message: "分类已经存在"
            })
            return Promise.reject()
        } else {
            return new Category({
                name: name
            }).save()
        }
    }).then(function (value) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: "/admin/category_index"
        })
    })
});


router.get("/category_list", function (req, res, next) {

    var page = Number(req.query.page || 1)
    var limit = 2

    var pages = 0   //总页数

    Category.count().then(function (count) {

        pages = Math.ceil(count / limit)
        page = Math.min(page, pages)
        page = Math.max(page, 1)

        var skip = (page - 1) * limit

        /**
         * sout 生序id 1  mongodb 默认生成ID带有时间戳
         */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_list', {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                pages: pages,
                limit: limit,
                count: count
            })
        })
    })
});


/**
 * 分类修改
 */

router.get('/category/edit', function (req, res) {
    //获取分类信息，并且用表单的形式展示出来
    var id = req.query.id || "";
    Category.find({
        _id: id
    }).then(function (category) {
        if (!category) {

            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "分类信息不存在"
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            })
        }

    })

})

/**
 * 提交分类修改
 */
router.post('/category/edit', function (req, res) {
    //获取分类信息，并且用表单的形式展示出来
    var id = req.query.id || "";
    var newName = req.body.name || "";

    Category.find({
        _id: id
    }).then(function (category) {
        if (!category) {

            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "分类信息不存在"
            });
        } else {
            //要修改的分类名称是否已经在数据库中存在
            if (newName == category.name) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                })
                return Promise.reject()
            } else {
                Category.findOne({
                    name: newName,
                    _id: {$ne: id}
                }).then(function (been) {
                    if (been) {
                        res.render("admin/error", {
                            userInfo: req.userInfo,
                            message: "用户名已存在",
                            url: '/admin/category'
                        })
                        return Promise.reject()
                    } else {
                        return Category.update({
                            _id: id
                        }, {
                            name: newName
                        })
                    }
                }).then(function (value) {
                    res.render('admin/success', {
                        userInfo: req.userInfo,
                        message: "修改成功",
                        url: '/admin/category_index'
                    })
                })
            }
        }

    })

})
/**
 * 分类删除
 */

router.get("/category/delete", function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || "";
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: "删除成功",
            url: "/admin/category_index"
        })
    })
});

/**
 * 内容首页
 */
router.get("/content", function (req, res) {
    var page = Number(req.query.page || 1)
    var limit = 2

    var pages = 0   //总页数

    Content.count().then(function (count) {

        pages = Math.ceil(count / limit)
        page = Math.min(page, pages)
        page = Math.max(page, 1)

        var skip = (page - 1) * limit

        /**
         * sout 生序id 1  mongodb 默认生成ID带有时间戳
         */
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                pages: pages,
                limit: limit,
                count: count
            })
        })
    })
});
/**
 * 内容添加
 */
router.get("/content/add", function (req, res) {

    Category.find().sort({_id:-1}).then(function (categories) {
        res.render('admin/content_index_add', {
            userInfo: req.userInfo,
            categories:categories
        })
    })

})

router.post("/content/add",function (req, res) {
    if (req.body.category==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        });
        return
    }
    if (req.body.title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return
    }
   //保存数据到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,
        user:req.userInfo._id.toString(),
    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功'
        })
    })

})

router.get("/content/edit",function (req, res) {
    var id = req.query.id ||'';

    var categories=[];
    Category.find().sort({_id:1}).then(function (rs) {
        categories=rs;
        return Content.findOne({
            _id:id
        }).populate('category')
    }).then(function (content) {
        if (!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"指定内容不存在"
            })
            return Promise.reject()
        } else {
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                content:content,
                categories:categories
            })
        }
    })
});


router.post("/content/edit",function (req, res) {
    var id = req.query.id ||'';

   Content.update({
       _id:id
   },{
       category:req.body.category,
       title:req.body.title,
       description:req.body.description,
       content:req.body.content
   }).then(function () {
       res.render('admin/success',{
           userInfo:req.userInfo,
           message:"修改内容成功"
       })
   })

});

router.get("/content/delete",function (req, res) {
    var id = req.query.id ||'';

    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"删除成功"
        })
    })

});


module.exports = router