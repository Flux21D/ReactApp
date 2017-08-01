'use strict';

var client = require("../../utils/contentful");

module.exports = function (req, res) {

  client.getEntries({
    'sys.contentType.sys.id': 'downloadItem'
  }).then(function (entries) {

    var downloadItems = entries.items.map(function (entry) {
      return entry.fields;
    });

    res.json(downloadItems);
  });
};