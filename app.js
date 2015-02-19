/**************************************************************************
 * LOAD MODULES
 *************************************************************************/

var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    config = require('./config'),
    mongoose = require('./lib/mongoose'),
    middleware = require('./lib/middleware'),
    redirector = require('./lib/redirector'),
    auth = require('./apps/auth/app'),
    api = require('./apps/api/app');

/**************************************************************************
 * CREATE MAIN EXPRESS APP
 *************************************************************************/

// Instantiate express and export
var app = module.exports = express();

/**************************************************************************
 * CONFIGURATION
 *************************************************************************/

// Define settings
app.set('port', process.env.PORT || config.server.port);
app.set('address', process.env.ADDRESS || config.server.listen);
app.disable('x-powered-by');
app.disable('etag');

/**************************************************************************
 * COMMON MIDDLEWARE
 *************************************************************************/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
app.use(middleware.sessions());


/**************************************************************************
 * REMEMBER WHERE A REQUEST NEEDS TO RETURN TO
 *************************************************************************/
app.use(middleware.returnto());


/**************************************************************************
 * REDIRECTOR SETUP
 *************************************************************************/
redirector()
    .options(config.redirects);


/**************************************************************************
 * MONGODB SETUP
 *************************************************************************/
mongoose.setup(config);

/**************************************************************************
 * LOAD EXPRESS APPS AS MIDDLEWARE
 *************************************************************************/

console.log('Loading express applications...');
app.use('/auth', auth);
app.use('/api', api);

/**************************************************************************
 * ERROR HANDLING MIDDLEWARE
 *************************************************************************/
// Anything not matched by previous middleware or routing is considered 404
app.use(function(req, res, next){
    res.redirect('/auth/login');
});
