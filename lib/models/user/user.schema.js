'use strict';

var mongoose = require('../../mongoose'),
    errors = require('../../errors'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var User = new mongoose.Schema(
    {
        firstname: {type: String, required: false },
        lastname : {type: String, required : false},
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique : true
        },
        picture : { type: String, required: false, default:'' },
        
        _auth : {
            local : { type: String, select: false },
            google: { type: String, select: false }
        }
        
    },
    {
        toJSON    : { hide: '_auth.local' }
    }
);


/**************************************************************************
 * Schema virtuals
 *************************************************************************/


User.virtual('token')
    .get(function() {
        return {
            '_id': this._id
        };
    });


/**************************************************************************
 * Schema statics
 *************************************************************************/

/**
 * Perform local authentication
 *
 * @param {string} email - Email of the user (case insensitive)
 * @param {string} password - Cleartext password
 * @param {function} cb - Callback funtion receives (err, User|false, errInfo)
 * @returns {*}
 */
User.statics.login = function (email, password, cb) {

    // Lowercase the email
    if (typeof email !== 'string') return cb(new errors.InvalidCredentialsError());
    email = email.toLowerCase();

    this.findOne({'email': email})
        .select('+_auth.local')
        .exec(function (error, doc) {

            if (error) return cb(error, false);
    
            if (!doc) {
                return cb(new errors.InvalidCredentialsError(), false);
            }
    
            bcrypt.compare(password, doc._auth.local, function(err, isMatch) {
    
                if (err) return cb(err, false);
    
                if (isMatch) return cb(null, doc);
    
                cb(new errors.InvalidCredentialsError(), false);
            });

    });
};


/**************************************************************************
 * Pre-* hooks
 *************************************************************************/

/**
 * Pre-save middleware to pull out the plaintext password and hash it..
 * since this needs to run async we cannot use a regular setter
 */
User.pre('save', true, function (next, done) {

    next(); // kickoff next parallel middleware
    
    var self = this;

    // only hash the password if it has been modified/new
    if (! self.isModified('_auth.local') ) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

        if (err) return done(err);

        // create new password hash using the previously created salt
        bcrypt.hash(self._auth.local, salt, function(err, hash) {

            if (err) return done(err);

            // override the cleartext password with the hashed one
            self._auth.local = hash;

            done();
        });
    });
});

/**
 * Pre-save middleware to check if the email has not been registered yet
 * and turn it into a ValidationError instead of the E11000 Integrity error
 */
User.pre('validate', true, function (next, done) {

    next(); // kickoff next parallel middleware

    var self = this;

    this.constructor.findOne({email: self.email}, function(err, doc) {

        if (err) return done(err);

        if (doc) {

            if(self._id.toString() === doc._id.toString()) return done();

            self.invalidate('email',
                new mongoose.Error.ValidatorError('email', 'The specified email address is already in use.', 'unique', self.email)
            );
        }
        done();
    });
});


module.exports = exports = mongoose.Model('User', User);
