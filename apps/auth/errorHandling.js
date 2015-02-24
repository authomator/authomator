/**************************************************************************
 * LOAD MODULES
 *************************************************************************/

var errors = require('../../lib/errors'),
    logger      = require('../../lib/logger'),
    _           = require('lodash');


exports = module.exports = function (err, req, res, next) {

    var meta = {};

    meta.ip         = req.hasOwnProperty('ip') ? req.ip : 'UNKNOWN';
    meta.ips        = req.hasOwnProperty('ips') ? req.ips : 'UNKNOWN';
    meta.host       = req.hasOwnProperty('host') ? req.host : 'UNKNOWN';
    meta.protocol   = req.hasOwnProperty('protocol') ? req.protocol : 'UNKNOWN';
    meta.method     = req.hasOwnProperty('method') ? req.method : 'UNKNOWN';
    meta.originalUrl= req.hasOwnProperty('originalUrl') ? req.originalUrl : 'UNKNOWN';
    meta.user       = req.hasOwnProperty('user') ? req.user : {};
    meta.return     = req.hasOwnProperty('return') ? req.return : 'UNKNOWN';


    if (err instanceof errors.ForbiddenError) {
        logger.log('error', 'ForbiddenError', _.merge(meta, err));
        return res.status(403).render('error', 
            {
                title: 'Forbidden', 
                message: 'Unable to process your request. This request was logged for further analysis.'
            }
        );
    }
    
    logger.log('error', 'UNEXPECTED ERROR : HTTP 500', _.merge(meta, {'err.name': err.name, 'err.message': err.message}));
    res.status(500).render('error',
        {
            title: 'Internal Server Error',
            message: 'Something unexpected occured. This request was logged for further analysis.'
        }
    );
};