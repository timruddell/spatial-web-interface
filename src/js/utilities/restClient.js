'use strict'

/* 
    Preconfigured rest client for working with the Pinnet webservices.
*/

const rest = require("rest");
const mimeInterceptor = require('rest/interceptor/mime');
const pathPrefixInterceptor = require('rest/interceptor/pathPrefix');

var client = rest.wrap(mimeInterceptor)
    .wrap(pathPrefixInterceptor, { prefix: 'http://localhost:3000' });

module.exports = client;