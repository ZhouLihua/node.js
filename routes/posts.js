var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

var checkLogin = require('../middlewares/check').checkLogin;

require('../models/collections')();
var Post = mongoose.model('Post');

// GET /posts 所有用户或者特定用户的文章
router.get('/', function(req, res, next) {
    var author = req.query.author;
    Post.find({
        'author': author
    }, function(err, posts) {
        if (err) {
            next(err);
        } else {
            res.render('posts', {
                posts: posts,
            });
        }
    });
});

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function(req, res, next) {
    var author = req.session.user;
    var title = req.fields.title;
    var content = req.fields.content;
    console.log(req.session);
    try {
        if (!title.length) {
            throw new Error('标题不能为空');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch (err) {
        next(err);
    }
    var post = new Post();
    post.author = author._id;
    post.title = title;
    post.content = content;
    post.pv = 0;
    post.save(function(err, result) {
        if (err) {
            next(err);
        } else {
            console.log(result);
            var id = result._id;
            req.flash('success', '发表文章成功');
            res.redirect(`/posts/${id}`);
        }
    });
});

// GET /posts/create 发表文章
router.get('/create', checkLogin, function(req, res, next) {
    res.render('create');
});

// GET /posts/:postId 获取单独一篇文章
router.get('/:postId', function(req, res, next) {
    var postId = req.params.postId;
    Post.findOne({
        '_id': postId
    }, function(err, post) {
        if (err) {
            next(err);
        } else {
            req.flash('success', '获取文章成功');
            res.render('post', {
                post: post
            });
        }
    });
});

// GET /posts/:postId/edit 获取更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user;
    Post.findOne({
        '_id': postId
    }, function(err, post) {
        if (err || !post) {
            req.flash('error', '文章不存在');
            res.redirect('back');
        } else if (post.author._id.toString() != author._id.toString()) {
            req.flash('error', '非作者不能更新文章');
            req.redirect('back');
        } else {
            res.render('edit', {
                post: post
            });
        }
    });
});

// POST /posts/:postId/edit 更新文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user;
    var title = req.fields.title;
    var content = req.fields.content;
    Post.update({
        '_id': postId,
        'author': author
    }, {
        '$set': {
            'title': title,
            'content': content
        }
    }, function(err) {
        req.flash('success', '编辑文章成功');
        res.redirect(`/posts/${postId}`);
    });
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.params.author;
    Post.remove({
        '_id': postId,
        'author': author
    }, function(err) {
        if (err) {
            next(err);
        } else {
            req.flash('success', '删除文章成功');
            res.redirect('/posts');
        }

    });
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
module.exports = router;
