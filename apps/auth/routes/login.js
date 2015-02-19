var router = require('express').Router();
var User = require('../../../lib/models/user/user.model');
var Errors = require('../../../lib/errors');
var redirector = require('../../../lib/redirector');


router
    .get('/login', function(req, res, next){
        res.render('login.jade');
    })

    .post('/login', function(req, res, next){

        req.assert('email', 'Email address required').notEmpty();
        req.assert('email', 'Valid email required').isEmail();
        req.assert('password', 'Password must be 6 to 20').len(6, 20);
    
        var errors = req.validationErrors();
        if (errors) {
            return res
                .status(400)
                .render('login.jade', {
                    validationError: true,
                    errors: errors,
                    email: req.body.email
                });
        }
    
        User.login(req.body.email, req.body.password, function(err, doc){
            if (err) {
                if (err instanceof Errors.InvalidCredentialsError) {
                    return res
                        .status(400)
                        .render('login.jade', {
                            invalidCredentials: true,
                            email: req.body.email
                        });
                }
                return next(err);
            }
            return redirector().redirect(doc, req, res, next);
        });

}   );

module.exports = exports = router;