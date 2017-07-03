const request = require('request');
var push = require('./publish-controller');
module.exports = {

  userinfo: (req, res) => {

  		const {AccessToken} = req.query;
  		var options = {
    		url: "https://elililly-dev.janraincapture.com/entity?type_name=user&access_token="+AccessToken,
    		method: 'GET'
		}
		request(options, function (error, response, body) {
    		if (!error && response.statusCode == 200) {
              		let usrinfo = JSON.parse(body);
                  let email = usrinfo.result.professionalContactData.emailAddress || '';
                  let specialty = usrinfo.result.professionalData.specialty || usrinfo.result.professionalData.professionalGroup || '';
              		let isEmployee = usrinfo.result.controlFields.notes === 'Lilly' ? 'lilly':'normal';
                  push.saveUser(usrinfo.result.uuid,email,specialty,isEmployee);
              		res.json(body)
	        }
		})

  }

};