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

var app = require('../../../app');
var User = require('./user.model.js');
var mocks = require('./user.mocks.js');


describe('Models.User', function() {

    var user;

    beforeEach(function(done){
        User.remove({}, done);
    });

    beforeEach(function(){
        user = new User(mocks.Dummy1);
    });


    it('should begin with no users', function(done) {
        User.find({}, function(err, users) {
            expect(err).to.not.exist;
            expect(users).to.have.length(0);
            done();
        });
    });

    it('should create user with all properties');

    it('should create user with an encrypted password', function(done) {

        var doc = new User(mocks.Dummy1);

        doc.save(function(error){
            expect(error).to.not.exist;
            expect(doc).to.have.a.deep.property('_auth.local');
            expect(doc._auth.local).to.not.equal(mocks.Dummy1._auth.local);
            return done();
        });
    });


    //it('should allow creation of users without a password', function(done) {
    //
    //    var user2 = _.cloneDeep(mocks.Dummy1);
    //    delete user2.password;
    //
    //    var doc = new User(user2);
    //
    //    doc.save(function(error){
    //
    //        expect(error).to.exist;
    //        expect(error.name).to.equal('ValidationError');
    //        expect(error).to.have.a.deep.property('name', 'ValidationError');
    //        expect(error).to.have.a.deep.property('errors.password.type', 'required');
    //
    //        return done();
    //    });
    //});
    //
    //
    //it('should prevent creation of users with an empty password', function(done) {
    //
    //    var user2 = _.cloneDeep(mocks.Dummy1);
    //    user2.password = "";
    //
    //    var doc = new User(user2);
    //
    //    doc.save(function(error){
    //
    //        expect(error).to.exist;
    //        expect(error.name).to.equal('ValidationError');
    //        expect(error).to.have.a.deep.property('name', 'ValidationError');
    //        expect(error).to.have.a.deep.property('errors.password.type', 'required');
    //
    //        return done();
    //    });
    //});


    it('should prevent creation of users with a duplicate email', function(done) {
        var user2 = _.cloneDeep(mocks.Dummy1);

        var doc1 = new User(mocks.Dummy1);
        var doc2 = new User(user2);

        doc1.save(function(error){

            expect(error).to.not.exist;

            doc2.save(function(err) {

                expect(err.message).to.equal('Validation failed');
                expect(err.name).to.equal('ValidationError');
                expect(err).to.have.a.deep.property('errors.email.message', 'The specified email address is already in use.');
                done();
            });
        });
    });


    it('should lowercase an email address', function(done) {
        var user2 = _.cloneDeep(mocks.Dummy1);
        user2.email = "test@TeSt.Com";

        var doc = new User(user2);

        doc.save(function(error){

            expect(error).to.not.exist;
            expect(doc.email).to.equal(mocks.Dummy1.email);
            return done();
        });
    });


    it('should not send the password and provider property when toJSON is called', function(done){

        var doc = new User(mocks.Dummy1);

        doc.save(function(error){

            expect(error).to.not.exist;
            expect(doc.toJSON()).to.not.have.a.deep.property('_auth.local');
            expect(doc.toJSON()).to.have.a.property('email');
            return done();
        });
    });


    describe('#login()', function() {

        it('should authenticate users with correct credentials', function(done) {

            var doc = new User(mocks.Dummy1);

            doc.save(function(error){

                expect(error).to.not.exist;

                User.login(mocks.Dummy1.email, mocks.Dummy1._auth.local, function(err, doc){
                    
                    expect(err).to.not.exist;
                    expect(doc).to.be.an.object;
                    expect(doc).to.have.a.deep.property('firstName', mocks.Dummy1.firstName);
                    done();
                });
            });
        });


        it('should authenticate users with correct credentials using case insensitive email matching', function(done) {
        
            var doc = new User(mocks.Dummy1);
        
            doc.save(function(error){
        
                expect(error).to.not.exist;
        
                User.login("TeSt@TesT.COM", mocks.Dummy1._auth.local, function(err, doc){
        
                    expect(err).to.not.exist;
                    expect(doc).to.be.an.object;
                    expect(doc).to.have.a.deep.property('email', mocks.Dummy1.email);
                    done();
                });
            });
        });
        
        
        it('should not authenticate users using empty password', function(done) {
        
            var doc = new User(mocks.Dummy1);
        
            doc.save(function(error){
        
                expect(error).to.not.exist;
        
                User.login(mocks.Dummy1.email, '', function(err, doc){
        
                    expect(err).to.exist;
                    expect(doc).to.be.false;
                    expect(err.name).to.equal('InvalidCredentialsError');
                    expect(err.message).to.equal('Invalid credentials');
                    done();
                });
            });
        });
        
        
        it('should not authenticate users using incorrect password', function(done) {
        
            var doc = new User(mocks.Dummy1);
        
            doc.save(function(error){
        
                expect(error).to.not.exist;
        
                User.login(mocks.Dummy1.email, 'somewrongpassword', function(err, doc){
        
                    expect(err).to.exist;
                    expect(doc).to.be.false;
                    expect(err.name).to.equal('InvalidCredentialsError');
                    expect(err.message).to.equal('Invalid credentials');
                    done();
                });
            });
        });
        
        
        it('should not indicate nonexistence of a user', function(done) {
        
            User.login(mocks.Dummy1.email, mocks.Dummy1._auth.local, function(err, doc){
        
                expect(err).to.exist;
                expect(doc).to.be.false;
                expect(err.name).to.equal('InvalidCredentialsError');
                expect(err.message).to.equal('Invalid credentials');
                done();
            });
        });
    });

});