var router = require('express').Router();
var User = require('../../../lib/models/user/user.model.js');
var Errors = require('../../../lib/errors/index');
var redirector = require('../../../lib/redirector/index');


router
    .post('/refresh/:rtoken', function(req, res, next){

        redirector().validateRefreshToken(req.params.rtoken, function(err, data){
            
            if (err) return res.status(400).json({message: 'Invalid refresh token'});
            
            User.findOne({_id: data.id}, function(err, doc){
                
                if (err) return res.status(400).json({message: 'Invalid refresh token'});
                
                if (!doc) return res.status(400).json({messsage: 'Invalid user refresh token'});
                
                return redirector().createTokens(doc, req, function(err, iToken, aToken, rToken){
                    if (err) return res.status(400).json({message: 'Unable to create tokens...soo sorry'});
                    
                    return res.json({it:iToken, at:aToken, rt:rToken});
                });
            });
        });
    });

module.exports = exports = router;