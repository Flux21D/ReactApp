'use strict';

var _ = require('lodash');
var cache = require('memory-cache');
var request = require('request');
var contentful = require('contentful');

module.exports = {

  /**
   * getPage()
   */
  getPage: function getPage(pageId, callback) {
    var pageData = cache.get(pageId);
    if (pageData === null) {
      // TODO move url ro env file
      var url = 'https://cdn.contentful.com/spaces/eu9epspp1nno/entries?access_token=2ac70afdcc4f9d34a318080f36501061c6f9948697eac01ed5770629765c3566&sys.id=' + pageId + '&include=4';
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
  }
};