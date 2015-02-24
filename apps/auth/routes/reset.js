var router = require('express').Router();
var User = require('../../../lib/models/user/user.model');
var redirector = require('../../../lib/redirector');

router

    .get('/reset/:token', function(req,res,next){
        res.render('reset/invalid-link.jade');
    });


module.exports = exports = router;