var express = require('express');
var router = express.Router();

var config = require('config-lite');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var mongoose = require('mongoose');

require('../models/collections')();

var User = mongoose.model('User');

// GET /signin 登陆页面
router.get('/', checkNotLogin, function(req, res, next){
    res.render('signin');
});

// POST /signin 用户登陆
// router.post('/', checkNotLogin, function(req, res, next){
    router.post('/', function(req, res, next){
    console.log('goes here.');
    var name = req.fields.name;
    var password = req.fields.password;
    User.findOne({'name': name}, function(err, user){
        if(!user){
            req.flash('error', '用户名不存在');
            res.redirect('back');
        }
        if(user.password != password){
            req.flash('error', '用户名或者密码错误');
            res.redirect('back');
        }

        req.flash('success', '登陆成功');
        delete user.password;
        req.session.user = user;
        res.redirect('/posts', {user: user});
        // next();
    });
});

module.exports = router;
