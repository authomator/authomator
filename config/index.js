'use strict';

var _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    vars = require('./vars');

/**************************************************************************
 * All configurations will extend these options
 *************************************************************************/

var defaults =  {

    server: {
        listen: vars.listen,
        port: vars.port,
        url: 'http://127.0.0.1'
    },

    // Reset password settings
    reset : {
        expiresInMinutes: 60 // time after which the reset token will expire
    },
    
    mail : {
        from: 'authomater@local',
        transport: {
            service: 'Mandrill',
            auth: {
                user: 'some@email.be',
                pass: 'someapikey'
            }
        }
    },
    
    redirects : {
        httpsOnly: false,
        acceptDomains: ['127.0.0.1'],
        defaultRedirect: 'http://127.0.0.1/'
    },
    
    jwt: {
        identity: {
            secret: "Iu+DOXws4q+/DrngmXkHCdzUfXSxFMT8hRU3Ng16QrcGsNAg5ztAUtcUFUOu0UxK6do=",
            options : {
                expiresInMinutes:     720,
                audience:             vars.appname,
                issuer:               vars.appname,
                algorithm:            "HS512"
            }
        },
        access : {
            secret: "Ktt03GXQI53l4XjC2rMcukUMrnSaB9voHiiBXqKaZ2qWZ4dHqQ9ozhtaZEaV0koSLM0=",
            options : {
                expiresInMinutes:     720,
                audience:             vars.appname,
                issuer:               vars.appname,
                algorithm:            "HS512"
            }
        },
        refresh : {
            secret: "O5C/Mi7mGRsFqr4X7q4Ycg/Rb966bWgD96vjmUckMR0wQWu8HFOHI8JB7i1HjEyNotw=",
            options : {
                expiresInMinutes:     720,
                audience:             vars.appname,
                issuer:               vars.appname,
                algorithm:            "HS512"
            }
        }
    },

    mongoose: {
        url: "mongodb://" + vars.mongodb_ip + "/" + vars.mongodb_collection,
        options: {
            db: { native_parser: true }
        }
    }
};


/**************************************************************************
 * Apply local config if present
 *************************************************************************/

if (fs.existsSync(path.resolve(__dirname, 'local.js'))){
    var environment = _.merge(
        defaults,
        require('./local.js') || {}
    );
}

/**************************************************************************
 * Export config
 *************************************************************************/
module.exports = defaults;