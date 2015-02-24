var router = require('express').Router();

module.exports = exports = {
    login: require('./login'),
    signup: require('./signup'),
    forgot: require('./forgot'),
    reset: require('./reset')
}