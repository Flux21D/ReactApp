const _ = require('lodash');
const cache = require('memory-cache');
const request = require('request');
const contentful = require('contentful');
const caccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const cspaceid = process.env.CONTENTFUL_SPACE_ID;
const cdomain = process.env.CONTENTFUL_DOMAIN;

module.exports = {

  /**
   * getPage()
   */
  getPage: (pageId, callback) => {
    const pageData = cache.get(pageId);
    if (pageData === null) {
      const url = 'https://'+cdomain+'/spaces/'+cspaceid+'/entries?access_token='+caccessToken+'&sys.id='+pageId+'&include=4';
      request.get({
        url,
        json: true,
        headers: { 'User-Agent': 'request' },
      }, (err, res, data) => {
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

  getCountry : (callback) => {
    const url = `https://${cdomain}/spaces/${cspaceid}/entries?access_token=${caccessToken}&content_type=countryCity&include=4`;
    request.get({
      url,
      json: true,
      headers: { 'User-Agent': 'request' },
    }, (err, res, data) => {
      if (err) {
        callback(null, err);
      } else if (res.statusCode !== 200) {
        callback(null, res.statusCode);
      } else if (data.items.length === 0) {
        // data is already parsed as JSON:
        console.log('Not found');
        callback(null, 'Page not found');
      } else { // Time is in ms
        callback(data, null);
      }
    });
  }
};
