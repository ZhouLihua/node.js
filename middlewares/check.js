module.exports = {
    checkLogin: function(req, res, next){
        console.log('In checkLogin function');
        if(!req.session.user){
            req.flash('error', 'Not Sign In');
            return res.redirect('/signin');
        }
        next();
    },

    checkNotLogin: function(req, res, next){
        if(req.session.user){
            req.flash('error', 'Already Signed In');
            return res.redirect('back');
        }
        next();
    }
};
