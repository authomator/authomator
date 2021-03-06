/**************************************************************************
 * LOAD MODULES
 *************************************************************************/


var express = require('express'),
    routes = require('./routes'),
    lusca = require('lusca'),
    path = require('path'),
    errorHandling = require('./errorHandling');

var app = module.exports = express();


/**************************************************************************
 * CONFIGURATION
 *************************************************************************/
app.set('baseUrl', '/auth');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.disable('x-powered-by');
app.disable('etag');


/**************************************************************************
 * APPLICATION SPECIFIC middleware.
 *************************************************************************/
app.use(lusca({
    csrf: true,
    xframe: 'SAMEORIGIN',
    xssProtection: true
}));
app.use('/public', express.static(path.join(__dirname, 'public')));


/**************************************************************************
 * Routes
 *************************************************************************/
app.use(routes.login);
app.use(routes.signup);
app.use(routes.forgot);
app.use(routes.reset);


/**************************************************************************
 * ERROR HANDLING MIDDLEWARE
 *************************************************************************/
app.use(errorHandling);
