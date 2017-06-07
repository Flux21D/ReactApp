'use strict';

var axios = require("axios");

var requireAuth = function requireAuth(req, res, next) {
    var AuthToken = req.query.AuthToken;

    var accessToken = req.get('authToken') || AuthToken;
    if (!accessToken) {
        return res.status(200).send({
            success: false,
            msg: 'No access token provided.'
        });
    }

    var options = {
        host: 'elililly-dev.janraincapture.com',
        path: '/entity?access_token=' + accessToken
    };

    var request = axios.get("https://" + options.host + options.path);

    request.then(function (response) {

        if (response.data.stat === "error") {
            return res.status(200).send({
                success: false,
                msg: 'Authorization fails.'
            });
        }

        next();
    }).catch(function (error) {
        res.status(200).send({
            success: false,
            msg: 'Authorization fails.'
        });
    });
};

module.exports = requireAuth;