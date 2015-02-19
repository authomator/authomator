'use strict';

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    async = require('async'),
    _ = require('lodash');

var expect = chai.expect;
chai.use(sinonChai);

/**************************************************************************
 * Begin of tests
 *************************************************************************/

var Redirector = require('./redirector');
var Errors = require('../errors');
var jsonwebtoken = require('jsonwebtoken');
var config = require('../../config');

describe('redirector', function() {

    describe ('#singletonFactory()', function(){
        it('should be a function');
        it('should return an object');
        it('should return a singleton object');
    });
    
    describe('Redirector', function(){
        
        it('should have its options set through the singletonFactory');

        describe('#options()', function(){
            it('should update its options ');
            it('should be chainable ');
        });

        describe('#validateRefreshToken()', function(){
            
            var token;
            before(function(done){
                token = jsonwebtoken.sign({id: "54e4a7067fe5503c1a3efca2"}, config.jwt.refresh.secret, config.jwt.refresh.options);
                done();
            });
            it('should validate a correct token', function(done){
                Redirector().validateRefreshToken(token, function(err, data){
                    expect(err).to.not.exist();
                    expect(data).to.have.a.property('id', "54e4a7067fe5503c1a3efca2");
                    done();
                });
            });
        });
        
        
        
        describe('#redirect()', function(){
            
            var redirector;
            var req;
            var user;
            
            var spyResRedirect;
            
            beforeEach(function(){
                
                redirector = Redirector();
                redirector.options({httpsOnly: true});
                
                user = {
                    toJSON: function(){return {'hello': 'me'}},
                    _id : {
                        toString : function(){return 'mongoDocId'}
                    }
                };
                
                req = {
                    session: {return: 'https://127.0.0.1/?t=1'}
                };
                
            });
            
            it('should use the default redirect url if req.session has no return url');
            
            it('should check if cleartext http redirects are allowed', function(done) {

                var res = {
                    redirect: function(){throw new Error('should not be called')}
                };
                req = {
                    session: {return: 'http://127.0.0.1'}
                };
                
                redirector.redirect(user, req, res, function(err){
                    expect(err).to.exist();
                    expect(err).to.have.a.property('message', 'Unable to forward token to non-https location');
                    done();
                });
                
            });
            
            
            it('should allow redirecting to non-https if explicitly configured', function(done){

                var res = {
                    redirect: function(url){
                        expect(url).to.contain('http://127.0.0.1');
                        done();
                    }
                };
                
                req = {
                    session: {return: 'http://127.0.0.1'}
                };
                var next = function(err){ throw new Error('should not be calling next(): ' + err.message)};
                
                redirector.options({httpsOnly: false});
                redirector.redirect(user, req, res, next);
            });
            
            
            it('should check if the domain to redirect to is authorized', function(done){

                var res = {
                    redirect: function(){throw new Error('should not be called')}
                };
                
                req = {
                    session: {return: 'https://127.0.0.2'}
                };
                
                redirector.redirect(user, req, res, function(err){
                    expect(err).to.exist();
                    expect(err).to.have.a.property('message', 'Unable to forward token to unauthorized location');
                    done();
                });
                
            }); 
            
            it('should unset the returnto key in the req.session', function(done){
                
                var next = function(){ throw new Error('not happening')};

                var res = {
                    redirect: function(url){
                        expect(req.session).to.not.have.a.property('return');
                        done();
                    }
                };
                expect(req.session).to.have.a.property('return');
                redirector.redirect(user, req, res, next);

                
            });

            it('should redirect to the returnto url key in the req.session', function(done){

                var next = function(){ throw new Error('not happening')};

                var expectedUrl = req.session.return;
                var res = {
                    redirect: function(url){
                        expect(url).to.include(expectedUrl);
                        expect(url).to.not.equal(expectedUrl);
                        done();
                    }
                };
                
                redirector.redirect(user, req, res, next);
            });
            
            
            it('should keep query params intact', function(done){

                var next = function(){ throw new Error('not happening')};
                
                req = {
                    session: {return: 'https://127.0.0.1?should=bethere'}
                };
                
                var res = {
                    redirect: function(url){
                        expect(url).to.contain('should=bethere');
                        done();
                    }
                };
                redirector.redirect(user, req, res, next);
            });
            
            
            it('should add the tokens in the redirected url', function(done){

                var next = function(){ throw new Error('not happening')};

                var res = {
                    redirect: function(url){
                        expect(url).to.contain('it=');
                        expect(url).to.contain('at=');
                        expect(url).to.contain('rt=');
                        done();
                    }
                };
                redirector.redirect(user, req, res, next);
            });
        });
        
    });
    
});