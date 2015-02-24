var router = require('express').Router();
var User = require('../../../lib/models/user/user.model');
var mail = require('../../../lib/mail');

router
    
    .get('/forgot', function(req,res,next){
        res.render('forgot/index.jade');
    })
    
    .post('/forgot', function(req, res, next){

        req.assert('email', 'Email address required').notEmpty();
        req.assert('email', 'Valid email required').isEmail();
    
        var errors = req.validationErrors();
        if (errors) {
            return res
                .status(400)
                .render('forgot.jade', {
                    validationError: true,
                    errors: errors,
                    email: req.body.email
                });
        }
        
        User.findOne({email:req.body.email}, function(err, doc){
 
            if (err) return next(err);
            if (!doc) {
                return res
                    .status(400)
                    .render('forgot.jade', {
                        notRegisteredError: true,
                        email: req.body.email
                    });
            }
 
            mail.sendPasswordReset(doc, function(err, data){
                if (err) return next(err);
                console.log('sent email with reset password:', data);
                res.render('forgot/sent.jade');
            });
            
         });
}   );

module.exports = exports = router;