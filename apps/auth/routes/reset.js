var router = require('express').Router();
var User = require('../../../lib/models/user/user.model');
var redirector = require('../../../lib/redirector');

router

    .get('/reset/:token', function(req,res,next){
        redirector()
            .validatePasswordResetToken(req.param('token'), function(err, data){
                
                if (err) return res.render('reset/invalid-link');
                
                User.findById(data.id, function(err, user){
                    
                    if (err) return next(err);
                    
                    if (!user) return res.render('reset/invalid-link');
                    res.render('reset/index', {
                        user: user,
                        token: req.param('token')
                    });
                });
            });
    })

    .post('/reset', function(req,res,next){

        redirector()
            .validatePasswordResetToken(req.body._token, function(err, token){
                
                if (err) return res.render('reset/invalid-link');

                req.assert('password', 'Password must be 6 to 20').len(6, 20);
                req.assert('password_confirm', 'Passwords do not match').equals(req.body.password);

                var errors = req.validationErrors();
                if (errors) {
                    return res
                        .status(400)
                        .render('reset/index', {
                            validationError: true,
                            errors: errors,
                            token: req.body._token
                        });
                }

                User.findById(token.id, function(err, user){
                    
                    if (err) return next(err);
                    if (!user) return res.render('reset/invalid-link');
                    
                    user._auth.local = req.body.password;
                    user.save(function(err){
                        if (err) return next(err);
                        res.render('reset/changed');
                    });
                    
                });
            });
    });


module.exports = exports = router;