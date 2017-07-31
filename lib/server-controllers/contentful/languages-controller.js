'use strict';

var client = require('../../utils/contentful');

module.exports = function (req, res) {
  client.getEntries({
    'sys.contentType.sys.id': 'sdCountry'
  }).then(function (entries) {
    var countries = entries.items.map(function (entry) {
      return entry.fields;
    });

    res.json(countries);
  });
};