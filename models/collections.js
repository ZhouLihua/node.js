var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User Schema

var User = new Schema({
    name: {type: String},
    password: {type: String},
    avatar: {type: String},
    gender: {type: String, enum: ['m', 'f', 'x']},
    bio: {type: String}
});

User.index({name: 1}, {unique: true});

// Post Schema
var Post = new Schema({
    author: {type: String},
    title: {type: String},
    content: {type: String},
    postTime:{type: Date, default: new Date()},
    pv: {type: Number}
});
// _id字段可以获取插入时间，也即是用户发布的时间，按时间降序排列
Post.index({author: 1, _id: -1});

module.exports = function(){
    mongoose.model('User', User);
    mongoose.model('Post', Post);
}
