const client = require("../../utils/contentful");

module.exports = function (req, res) {

  client.getEntries({
    'sys.contentType.sys.id': 'downloadItem'
  }).then(entries => {

    const downloadItems = entries.items.map(entry => {
      return entry.fields;
    });

    res.json(downloadItems);
  });

};