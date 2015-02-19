var router = require('express').Router();

//router.get('/', function(req, res){
//    return res.redirect('/login');
//});
//router.use(require('./login'));
//router.use(require('./signup'));
//router.use(require('./refresh'));
//
//router.get('/test', function(req, res, next){
//    res.render('test.jade');
//});

module.exports = exports = {
    login: require('./login'),
    signup: require('./signup')
}