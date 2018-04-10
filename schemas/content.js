var mongoose = require('mongoose');
//用户表结构
module.exports = new mongoose.Schema({

    //关联分类表
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },

    //关联用户表

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    addTime: {
        type: Date,
        default: new Date()
    },
    //阅读量
    views: {
        type: Number,
        default: 0
    },

    name: String,

    //简介
    description: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    comments:{
        type:Array,
        default:[]
    }
})