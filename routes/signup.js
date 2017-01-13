var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var sha1 = require('sha1')
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var mongoose = require('mongoose');
var config = require('config-lite');

require('../models/collections')()

var User = mongoose.model('User');
// GET /signup  注册页面
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
    console.log('Goes Here.');
    var name = req.fields.name;
    var gender = req.fields.gender;
    var bio = req.fields.bio;
    var avatarPath = req.files.avatar.path;
    var avatarName = path.basename(avatarPath);
    var password = req.fields.password;
    var confirmPassword = req.fields.repeatpassword;

    try {
        if (!(name.length > 0 && name.length < 11)) {
            throw new Error('名字限制在10个字符');
        }

        if (['m', 'f', 'x'].indexOf(gender) == -1) {
            throw new Error('性别只能是 m, f, x');
        }

        if (!(bio.length > 0 && bio.length < 256)) {
            throw new Error('个人介绍限制在256个字符以内');
        }

        if (!(req.files.avatar.name)) {
            throw new Error('缺少头像');
        }

        if (password != confirmPassword) {
            throw new Error('两次输入的密码不一致');
        }
    } catch (e) {
        fs.unlink(avatarPath);
        req.flash('error', e.message);
        res.redirect('/signup');
    }
    var user = new User();
    user.name = name;
    user.password = password;
    user.avatar = avatarName;
    user.gender = gender;
    user.bio = bio;
    user.save(function(err){
        if(err){
        fs.unlink(avatarPath);
        req.flash('error', '用户名被占用');
        return res.redirect('/signup');
    }else{
        delete user.password;
        req.session.user = user;
        req.flash('success', '注册成功');
        return res.redirect('/posts');
    }
    });
});

module.exports = router;
