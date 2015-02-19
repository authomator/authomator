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

describe('middleware.returnto', function() {
    
    it('should be a function');
    it('should return a middleware');
    it('should add returnto to req.session');
    it('should not add returnto to req.session if a return is already set');
    it('should check if cleartext http redirects are allowed');
    it('should check if the domain to redirect to is authorized');

});