/**************************************************************************
 * LOAD MODULES
 *************************************************************************/

var InvalidCredentialsError = require('./invalidCredentialsError'),
    UnauthorizedError       = require('./unauthorizedError'),
    ResourceNotFoundError   = require('./resourceNotFoundError'),
    FailedDependencyError   = require('./failedDependencyError'),

    mongoose    = require('mongoose'),
    logger      = require('../../logger'),
    _           = require('lodash');


exports = module.exports = function() {

    return function (err, req, res, next) {

        var meta = {};

        meta.ip         = req.hasOwnProperty('ip') ? req.ip : 'UNKNOWN';
        meta.ips        = req.hasOwnProperty('ips') ? req.ips : 'UNKNOWN';
        meta.host       = req.hasOwnProperty('host') ? req.host : 'UNKNOWN';
        meta.protocol   = req.hasOwnProperty('protocol') ? req.protocol : 'UNKNOWN';
        meta.method     = req.hasOwnProperty('method') ? req.method : 'UNKNOWN';
        meta.originalUrl= req.hasOwnProperty('originalUrl') ? req.originalUrl : 'UNKNOWN';
        meta.user       = req.hasOwnProperty('user') ? req.user : {};

        if (err instanceof InvalidCredentialsError) {
            logger.log('error', 'INVALID CREDENTIALS', meta);
            return res.status(401).json(err);
        }


        if (err instanceof UnauthorizedError) {
            logger.log('error', 'UNAUTHORIZED', meta);
            return res.status(401).json(err);
        }


        if (err instanceof ResourceNotFoundError) {
            logger.log('error', 'RESOURCE NOT FOUND', meta);
            return res.status(404).json(err);
        }


        if (err instanceof FailedDependencyError) {
            logger.log('error', 'FAILED DEPENDENCY', meta);
            return res.status(424).json(err);
        }


        if (err instanceof mongoose.Error.ValidationError) {
            logger.log('error', 'MONGOOSE VALIDATION', _.merge(meta, err));
            return res.status(422).json(err);
        }


        if (err instanceof mongoose.Error.CastError) {
            logger.log('error', 'MONGOOSE CAST', _.merge(meta, err));

            // Present cast error as validation error
            // so it can be parsed by the resources
            // as a regular validation error
            var validationError = {
                message: 'Validation failed',
                name: 'ValidationError',
                errors: {}
            };

            validationError.errors[err.path] = err;

            return res.status(422).json(validationError);
        }

        // Anything not catched above is treated as unexpected, without
        // releasing any details to the http response

        logger.log('error', 'UNEXPECTED ERROR : HTTP 500', _.merge(meta, {'err.name': err.name, 'err.message': err.message}));

        res.status(500).json(
            {
                name: 'UnexpectedError',
                message: 'An error occured while processing the request'
            }
        );
    }
};