var router = require('express').Router();

router
    
    .get('/forgot', function(req,res,next){
        res.render('forgot.jade');
    });
    

module.exports = exports = router;