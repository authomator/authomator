var path           = require('path'),
    emailTemplatesDir = path.resolve(__dirname, '../..', 'emails'),
    emailTemplates = require('email-templates'),
    nodemailer = require('nodemailer'),
    redirector = require('../redirector'),
    config = require('../../config');



var instance = null;

exports.transport = function(config) {
    if (instance === null) {
        instance = nodemailer.createTransport(config);
    }
    return instance;
};



exports.sendPasswordReset = function(user, done) {

    emailTemplates(emailTemplatesDir, function(err, template) {

        if (err) return done(err);

        var transport = exports.transport();

        redirector()
            .createPasswordResetToken(user, function (err, token) {

                if (err) return done(err);

                var locals = {
                    user: user,
                    link: config.server.url + '/auth/reset/' + token
                };

                template('reset-password', locals, function (err, html, text) {
                    
                    if (err) return done(err);
                    
                    transport.sendMail({
                        from: config.mail.from,
                        to: locals.user.email,
                        subject: 'Password reset requested',
                        html: html,
                        text: text
                    }, done);

                });

            });
    });
}