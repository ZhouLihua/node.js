var express = require('express');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var formidable = require('express-formidable');
var flash = require('connect-flash');
var config = require('config-lite');
var mongoose = require('mongoose');
var fs = require('fs');
var morgan = require('morgan');
var favicon = require('express-favicon');

var app = express();

mongoose.connect(config.mongodb);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, '/public/favicon.png')));
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));

app.use(flash());
app.use(formidable({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true,
}));

app.locals.blog = {
    title: 'miniBlog',
    description: 'Express + Mongodb + Node.js Learning Sample'
};

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

// routes

app.get('/', function(req, res){
    res.redirect('/posts');
});

app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));
app.use('/signout', require('./routes/signout'));
app.use('/posts', require('./routes/posts'));

app.listen(config.port, function(){
    console.log('Express Sample listening on port ' + config.port);
});
