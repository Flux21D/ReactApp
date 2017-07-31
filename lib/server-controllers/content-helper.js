'use strict';

var _ = require('lodash');
var cache = require('memory-cache');
var request = require('request');
var contentful = require('contentful');
var caccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
var cspaceid = process.env.CONTENTFUL_SPACE_ID;
var cdomain = process.env.CONTENTFUL_DOMAIN;

module.exports = {

  /**
   * getPage()
   */
  getPage: function getPage(pageId, callback) {
    var pageData = cache.get(pageId);
    if (pageData === null) {
      var url = 'https://' + cdomain + '/spaces/' + cspaceid + '/entries?access_token=' + caccessToken + '&sys.id=' + pageId + '&include=4';
      request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
      }, function (err, res, data) {
        if (err) {
          callback(null, err);
        } else if (res.statusCode !== 200) {
          callback(null, res.statusCode);
        } else if (data.items.length === 0) {
          // data is already parsed as JSON:
          console.log('Not found');
          callback(null, 'Page not found');
        } else {
          cache.put(pageId, data, 900000); // Time is in ms
          callback(data, null);
        }
      });
    } else {
      callback(pageData, null);
    }
  },

  getCountry: function getCountry(callback) {
    var url = 'https://' + cdomain + '/spaces/' + cspaceid + '/entries?access_token=' + caccessToken + '&content_type=countryCity&include=4';
    request.get({
      url: url,
      json: true,
      headers: { 'User-Agent': 'request' }
    }, function (err, res, data) {
      if (err) {
        callback(null, err);
      } else if (res.statusCode !== 200) {
        callback(null, res.statusCode);
      } else if (data.items.length === 0) {
        // data is already parsed as JSON:
        console.log('Not found');
        callback(null, 'Page not found');
      } else {
        // Time is in ms
        callback(data, null);
      }
    });
  }
};