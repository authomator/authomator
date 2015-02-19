Authomator
==========

This is a nodejs/express/mongo based authentication server. The goal is to take
care of authentication on the server and send the user to a url afterwards with
json web tokens.

 

Dependencies
------------

-   mongodb

 

Launch the server
-----------------

*(Assuming you've* [installed Node.js and npm and have a mongodb instance
running][1]*)*

[1]: <http://www.joyent.com/blog/installing-node-and-npm/>

Fork this repository, then clone your fork, and run this in your newly created
directory:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm install
npm start
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Your authomator project is now up and running! However, it will use defaults
that will probably not be usefull.. so read on how to configure it to do some
authomation for you...

 

### Configure the authomator service

Copy the \`config/index.js\` to \`config/local.js\` and start setting up...

 

Using the service
=================

 

General
-------

If you want a user to be authenticated send them to the authomator server and
include `?return=<url>` in the url where they should go back after having
authenticated.

Once a user registers or authenticates they are redirected to the `<url>` . The
url being redirected to will have the following query parameters:

-   it: jwt Identity Token  (can be used in you frontend app as it contains all
    public data about the user)

-   at: jwt Access Token (can be used to send to your backend app it contains
    only the userId)

-   rt: jwt Refresh Token (is used to retrieve a new set of tokens)

 

Refreshing tokens
-----------------

From your application do a HTTP post to:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
https://authomator.url/api/refresh/<rt>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 

Where `<rt>` is the Refresh token you got when the user logged in or registered.
If the token is valid the server will give you 3 new tokens in a json response:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{
    it: "<identityToken>"
    at: "<accessToken>"
    rt: "<refreshToken>"
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Drop the old 3 tokens you had and use the new ones.. thats it...

 
