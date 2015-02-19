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
var User = require('../../../lib/models/user/user.model');


describe('api.refresh', function() {

    describe('POST /refresh/:token', function () {
        
        beforeEach(function(done){
            
        });
        
        it('should refuse invalid tokens');
        it('should return tokens for a valid token');
    });
    
});