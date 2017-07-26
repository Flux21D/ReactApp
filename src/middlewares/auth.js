const axios = require("axios");

const requireAuth = (req, res, next) => {

  const {AuthToken} = req.query;
  const accessToken = req.get('authToken') || AuthToken;
  if (!accessToken) {
    return res.status(200).send({
      success: false,
      msg: 'No access token provided.'
    });
  }

  const options = {
    host: 'elililly-dev.janraincapture.com',
    path: '/entity?access_token=' + accessToken
  };

  const request = axios.get("https://" + options.host + options.path);

  request.then(response => {

    if (response.data.stat === "error") {
      return res.status(200).send({
        success: false,
        msg: 'Authorization fails.'
      });
    }

    next();
  }).catch(error => {
    res.status(200).send({
      success: false,
      msg: 'Authorization fails.'
    });
  });

};

module.exports = requireAuth;