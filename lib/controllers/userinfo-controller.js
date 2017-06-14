'use strict';

var request = require('request');
var push = require('./publish-controller');
module.exports = {

  userinfo: function userinfo(req, res) {
    var AccessToken = req.query.AccessToken;

    var options = {
      url: "https://elililly-dev.janraincapture.com/entity?type_name=user&access_token=" + AccessToken,
      method: 'GET'
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var usrinfo = JSON.parse(body);
        push.saveUser(usrinfo.result.uuid, usrinfo.result.professionalContactData.emailAddress, usrinfo.result.professionalData.specialty);
        res.json(body);
      }
    });
  }

};