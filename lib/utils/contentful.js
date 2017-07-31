'use strict';

var contentful = require('contentful');
var configs = require('../configs/contentful');

var client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: configs.SPACE_ID,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: configs.ACCESS_TOKEN
});

module.exports = client;