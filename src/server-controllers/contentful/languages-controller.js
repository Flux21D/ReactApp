const client = require("../../utils/contentful");

module.exports = function (req, res) {

  client.getEntries({
    'sys.contentType.sys.id': 'sdCountry'
  }).then((entries) => {

    let countries = entries.items.map(entry => {
      return entry.fields;
    });

    res.json(countries);
  });

};