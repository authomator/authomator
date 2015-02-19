/**************************************************************************
 * LOAD MODULES
 *************************************************************************/


var express = require('express'),
    routes = require('./routes');

var app = module.exports = express();


/**************************************************************************
 * CONFIGURATION
 *************************************************************************/
app.disable('x-powered-by');
app.disable('etag');

/**************************************************************************
 * APPLICATION SPECIFIC middleware.
 *************************************************************************/


/**************************************************************************
 * Routes
 *************************************************************************/

app.use(routes.refresh);


/**************************************************************************
 * ERROR HANDLING MIDDLEWARE
 *************************************************************************/

// Anything not matched by previous middleware or routing is considered 404
// it is important to keep this in here so that anything underneath /api is getting proper
// 404
app.use(function(req, res, next){
    res.sendStatus(404);
});

// Would be nice to have here !!