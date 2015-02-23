var async = require('async'),
    url = require('url'),
    _ = require('lodash'),
    errors = require('../errors'),
    jsonwebtoken = require('jsonwebtoken'),
    config = require('../../config'),
    bcrypt = require('bcrypt'),
    logger = require('../logger');


var redirector = null;

function Redirector() {
    
    
    this._options = {
        sessionKey: 'return',
        httpsOnly: true,
        acceptDomains: ['127.0.0.1'],
        defaultRedirect: 'http://127.0.0.1/'
    };
    
    this._createIdentityToken = function(user, req, done) {
        
        done(
            null, 
            jsonwebtoken.sign(
                user.toJSON(), 
                config.jwt.identity.secret, 
                config.jwt.identity.options
            )
        );
    };
    
    
    this._createAccessToken = function(user, req, done){

        done(
            null,
            jsonwebtoken.sign(
                {id: user._id.toString()},
                config.jwt.access.secret,
                config.jwt.access.options
            )
        );
    };
    
    
    this._createRefreshToken = function(user, req, iToken, aToken, done){

        done(
            null,
            jsonwebtoken.sign(
                {id: user._id.toString()},
                config.jwt.refresh.secret,
                config.jwt.refresh.options
            )
        );
        
    };
    
};


Redirector.prototype.options = function options (opts) {

    var self = this;
    if (opts) _.merge(self._options, opts);
    return self;
    
};


Redirector.prototype.createTokens = function (user, req, done) {

    var iToken = '';
    var aToken = '';
    var rToken = '';

    var self = this;
    
    async.series([

        // Create Identity and Access tokens
        function createIdentityAndAccess(done){

            async.parallel([

                function createIdentityToken(done) {
                    self._createIdentityToken(user, req, function(err, token){
                        iToken = token;
                        return done(err);
                    });
                },

                function createAccessToken(done) {
                    self._createAccessToken(user, req, function(err, token){
                        aToken = token;
                        return done(err);
                    });
                },

            ], done);
        },

        function createRefresh(done) {
            self._createRefreshToken(user, req, iToken, aToken, function(err, token){
                rToken = token;
                done(err);
            });
        }

    ], function(err){
        
        return done(err, iToken, aToken, rToken);

    });
};


Redirector.prototype.validateRefreshToken = function(rToken, callback) {

    jsonwebtoken.verify(
        rToken,
        config.jwt.refresh.secret,
        config.jwt.refresh.options
        , function(err, data){
            return callback(err, data);
        });
};


Redirector.prototype.redirect = function run (user, req, res, next) {
    
    var self = this;
    var redirectUrlString = this._options.defaultRedirect;
    

    if  ( req.session && _.has(req.session, self._options['sessionKey']) ) {
        redirectUrlString = req.session[this._options.sessionKey];
    }
    
    var redirectUrl = url.parse(redirectUrlString, true);
    
    if ( ! self._options.httpsOnly ) logger.warn('Allowing redirect to non https locations !!!');
    
    if (redirectUrl.protocol != 'https:' && self._options.httpsOnly) {
        return next(new errors.ForbiddenError('Unable to forward token to non-https location'));
    }
    
    if ( ! _.includes(self._options.acceptDomains, redirectUrl.hostname ) ){
        return next(new errors.ForbiddenError('Unable to forward token to unauthorized location'));
    }
    
    this.createTokens(user, req, function(err, iToken, aToken, rToken){
        
        if (err) return next(err);

        delete req.session[self._options.sessionKey];

        delete redirectUrl.search; // otherwise url.format() will use this as search
        redirectUrl.query['it'] = iToken;
        redirectUrl.query['at'] = aToken;
        redirectUrl.query['rt'] = rToken;
        return res.redirect(url.format(redirectUrl));    
    });
    
};



module.exports = exports = function SingletonFactory(opts) {
    if (redirector !== null) return redirector;
    redirector = new Redirector();
    if (opts) redirector.options(opts);
    return redirector;
};