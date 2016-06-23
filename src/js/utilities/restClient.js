'use strict'

/* 
    Preconfigured rest client for working with the Pinnet webservices.
*/

const rest = require("rest");
const mimeInterceptor = require('rest/interceptor/mime');

var client = rest.wrap(mimeInterceptor);

module.exports = client;