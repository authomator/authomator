var _ = require('lodash');

module.exports = exports = function() {
    
    return function (req, res, next) {
        if (req.query.return !== undefined) {
            req.session.return = req.query.return;
        }
        return next();
    }
    
}