var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),

    expect = chai.expect;
chai.use(sinonChai);


/**************************************************************************
 * Begin of tests
 *************************************************************************/


var mailer = require('./index.js');

describe('Mail', function(){

    describe('#transport()', function() {
        it('should be a singleton factory');
        it('returns a nodemailer transport');        
    });

    describe('#sendPasswordReset()', function(){
        it('should be a function');
        it('should send a reset password email');
    });

});