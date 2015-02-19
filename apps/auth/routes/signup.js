var router = require('express').Router();
var mongoose = require('mongoose');
var User = require('../../../lib/models/user/user.model');
var Errors = require('../../../lib/errors');
var redirector = require('../../../lib/redirector');

router
    
    .get('/sign-up', function(req,res,next){
        res.render('signup.jade');
    })
    
    .post('/sign-up', function(req,res,next){

        req.assert('firstname', 'Firstname required').notEmpty();
        req.assert('lastname', 'Lastname required').notEmpty();
        req.assert('email', 'Email address required').notEmpty();
        req.assert('email', 'Valid email required').isEmail();
        req.assert('password', 'Password must be 6 to 20').len(6, 20);


        var errors = req.validationErrors();
        if (errors) {
            return res
                .status(400)
                .render('signup.jade', {
                    validationError: true,
                    errors: errors,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                });
        }
        

        var user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        });
        user._auth.local = req.body.password;
        user.save(function (err, doc) {
            if (err){
                // Email might already be taken...
                if (err instanceof mongoose.Error.ValidationError) {
                    if (err.errors.email &&
                        err.errors.email instanceof mongoose.Error.ValidatorError &&
                        err.errors.email.type === 'unique') {
                        return res
                            .status(400)
                            .render('signup.jade', {
                                validationError: true,
                                errors: [{msg: 'Email is already registered'}],
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email
                            });
                    }
                }
                // Some other error occured, let the central err middleware handle it
                return next(err);
            }
            return redirector().redirect(doc, req, res, next);
        });
    });

module.exports = exports = router;