"use strict";

var axios = require("axios");
var extend = require("lodash").extend;
var configs = require("../configs/janrain");

var exchangeCodeToToken = function exchangeCodeToToken(code, cb) {

    var reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/token?";

    reqUrl += "grant_type=authorization_code&";
    reqUrl += "redirect_uri=https://" + process.env.HEROKU_DOMAIN + "/reset-password";
    reqUrl += "&code=" + code + "&";
    reqUrl += "client_id=" + configs.CLIENT_ID + "&";
    reqUrl += "client_secret=" + configs.CLIENT_SECRET;

    var request = axios.get(reqUrl);

    request.then(function (res) {
        if (res.data.stat === "ok") {
            return cb(null, res.data.access_token);
        }

        return cb({
            stat: "error",
            invalid_fields: {
                code: ["Code is not valid. Please try resetting your password again."]
            }
        });
    }).catch(function (error) {
        cb({
            stat: "error",
            invalid_fields: {
                code: ["Code is not valid. Please try resetting your password again."]
            }
        });
    });
};

module.exports = {

    auth: function auth(req, res, next) {

        var accessToken = req.body.accessToken;

        if (!accessToken) {
            return res.status(400).send({
                success: false,
                msg: 'No access token provided.'
            });
        }

        var options = {
            host: configs.APP_DOMAIN + '.janraincapture.com',
            path: '/entity?access_token=' + accessToken
        };

        var request = axios.get("https://" + options.host + options.path);

        request.then(function (response) {
            res.json(response.data.result);
        }).catch(function (error) {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });

        next();
    },
    register: function register(req, res) {
        var body = req.body;

        var data = void 0;

        var reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/register_native_traditional";

        data = extend(body, {
            client_id: configs.CLIENT_ID,
            flow: configs.FLOW,
            flow_version: configs.FORGOT_PASSWORD_FLOW_VERSION,
            locale: configs.LOCALE,
            redirect_uri: 'http://localhost:8080/',
            response_type: "token",
            form: 'registrationForm'
        });

        var request = axios.post(reqUrl, data);

        request.then(function (response) {
            res.json(response.data);
        }).catch(function (error) {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });
    },
    login: function login(req, res) {

        var reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/auth_native_traditional";

        var data = extend(req.body, {
            client_id: configs.CLIENT_ID,
            flow: configs.FLOW,
            flow_version: configs.FLOW_VERSION,
            locale: configs.LOCALE,
            redirect_uri: 'http://localhost:8080/',
            response_type: 'token',
            form: 'userInformationForm'
        });

        var request = axios.post(reqUrl, data);

        request.then(function (response) {
            res.json(response.data);
        }).catch(function (error) {
            res.status(500).send({
                error: error,
                success: false,
                msg: "Internal server error"
            });
        });
    },
    forgotPassword: function forgotPassword(req, res) {

        var reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/forgot_password_native";

        var data = extend(req.body, {
            client_id: configs.CLIENT_ID,
            flow: configs.FLOW,
            flow_version: configs.FORGOT_PASSWORD_FLOW_VERSION,
            locale: configs.LOCALE,
            redirect_uri: 'http://localhost:8080/',
            form: 'forgotPasswordForm'
        });

        var request = axios.post(reqUrl, data);

        request.then(function (response) {
            res.json(response.data);
        }).catch(function (error) {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });
    },
    resetPassword: function resetPassword(req, res) {
        var _req$body = req.body,
            code = _req$body.code,
            newPassword = _req$body.newPassword,
            newPasswordConfirm = _req$body.newPasswordConfirm;


        var reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/update_profile_native";

        exchangeCodeToToken(code, function (err, access_token) {

            if (err) {
                return res.json(err);
            }

            var data = {
                client_id: configs.CLIENT_ID,
                flow: configs.FLOW,
                flow_version: configs.FLOW_VERSION,
                locale: configs.LOCALE,

                //form: 'changePasswordFormNoAuth',
                form: "newPasswordForm",

                access_token: access_token,

                // newPassword: newPassword,
                // newPasswordConfirm: newPasswordConfirm,

                newpassword: newPassword,
                newpasswordConfirm: newPasswordConfirm
            };

            var request = axios.post(reqUrl, data);

            request.then(function (response) {

                if (response.data.stat === "ok") {
                    return res.json({
                        stat: "ok",
                        msg: "Your password was set successfully."
                    });
                }

                var respJson = {
                    stat: "error",
                    msg: "Something went wrong."
                };

                if (response.data.invalid_fields) {
                    respJson = extend(respJson, {
                        invalidFields: response.data.invalid_fields
                    });
                }

                res.json(respJson);
            }).catch(function (error) {
                res.status(500).send({
                    success: false,
                    msg: "Internal server error"
                });
            });
        });
    },
    verifyEmail: function verifyEmail(req, res) {
        var verificationCode = req.body.verificationCode;


        if (!verificationCode) {
            return res.status(400).send({
                success: false,
                msg: 'No verification code provided.'
            });
        }

        var reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/access/useVerificationCode?verification_code=" + verificationCode;

        var request = axios.get(reqUrl);

        return request.then(function (response) {
            res.json(response.data);
        }).catch(function (error) {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });
    },
    updateUser: function updateUser(req, res) {
        var body = req.body;


        var accessToken = req.get('authToken');

        var reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/update_profile_native";

        var data = extend(body, {
            client_id: configs.CLIENT_ID,
            flow: configs.FLOW,
            flow_version: configs.FORGOT_PASSWORD_FLOW_VERSION,
            locale: configs.LOCALE,
            redirect_uri: 'http://localhost:8080/',
            form: 'editProfileForm',
            access_token: accessToken
        });

        var request = axios.post(reqUrl, data);

        request.then(function (response) {
            res.json(response.data);
        }).catch(function (error) {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });
    }

};