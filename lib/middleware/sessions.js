var sessions = require('client-sessions');


module.exports = exports = function sessionFactory(config) {

    return sessions({
        // cookie name dictates the key name added to the request object
        cookieName: 'session',

        // should be a large unguessable string
        secret: 'FMIRNF+SJ1SQ5VlJNGrb4gn9MH59LL50Ha7UybSyDmbLvgn3dI4zzkkWSkhxg7Gh8OPr/2/3NKJpOfBtBvBBY8zSJ6EO4PM1UqlTLhCaQv84T7Hh44ENFe5bSvKzzX0sFbiKMw==',

        // how long the session will stay valid in ms
        duration: 24 * 60 * 60 * 1000,

        // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
        activeDuration: 1000 * 60 * 5,
        
        
        cookie: {
            ephemeral: false, // when true, cookie expires when the browser closes
            
            httpOnly: true, // when true, cookie is not accessible from javascript
            
            secure: false   // when true, cookie will only be sent over SSL. 
                            // use key 'secureProxy' instead if you handle SSL not in your node process
        }
    });
    
}
