const axios = require("axios");
const extend = require("lodash").extend;
const configs = require("../configs/janrain");

const exchangeCodeToToken = (code, cb) => {

    let reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/token?";

    reqUrl += "grant_type=authorization_code&";
    reqUrl += "redirect_uri=https://buit-eucan-olum-selfdetail-dev.herokuapp.com/reset-password?code="  + code[0] + "&";
    reqUrl += "code=" + code[1] + "&";
    reqUrl += "client_id=" + configs.CLIENT_ID + "&";
    reqUrl += "client_secret=" + configs.CLIENT_SECRET;

    const request = axios.get(reqUrl);

    request.then(res => {
        if (res.data.stat === "ok") {
            return cb(null, res.data.access_token);
        }

        return cb({
            stat: "error",
            invalid_fields: {
                code: ["Code is not valid. Please try resetting your password again."]
            }
        });
    }).catch(error => {
        cb({
            stat: "error",
            invalid_fields: {
                code: ["Code is not valid. Please try resetting your password again."]
            }
        });
    });
};

module.exports = {

    auth: (req, res, next) => {

        const accessToken = req.body.accessToken;

        if (!accessToken) {
            return res.status(400).send({
                success: false,
                msg: 'No access token provided.'
            });
        }

        const options = {
            host: configs.APP_DOMAIN + '.janraincapture.com',
            path: '/entity?access_token=' + accessToken
        };

        const request = axios.get("https://" + options.host + options.path);

        request.then(response => {
            res.json(response.data.result);
        }).catch(error => {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });

        next();
    },
    register: (req, res) => {

        let {body} = req;
        let data;

        const reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/register_native_traditional";

        data = extend(body, {
            client_id: configs.CLIENT_ID,
            flow: configs.FLOW,
            flow_version: configs.FORGOT_PASSWORD_FLOW_VERSION,
            locale: configs.LOCALE,
            redirect_uri: 'http://localhost:8080/',
            response_type: "token",
            form: 'registrationForm'
        });

        const request = axios.post(reqUrl, data);

        request.then(response => {
            res.json(response.data);
        }).catch(error => {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });
    },
    login: (req, res) => {

        const reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/auth_native_traditional";

        const data = extend(req.body, {
            client_id: configs.CLIENT_ID,
            flow: configs.FLOW,
            flow_version: configs.FLOW_VERSION,
            locale: configs.LOCALE,
            redirect_uri: 'http://localhost:8080/',
            response_type: 'token',
            form: 'userInformationForm'
        });

        const request = axios.post(reqUrl, data);

        request.then(response => {
            res.json(response.data);
        }).catch(error => {
            res.status(500).send({
                error: error,
                success: false,
                msg: "Internal server error"
            });
        });

    },
    forgotPassword: (req, res) => {

        const reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/forgot_password_native";

        const data = extend(req.body, {
            client_id: configs.CLIENT_ID,
            flow: configs.FLOW,
            flow_version: configs.FORGOT_PASSWORD_FLOW_VERSION,
            locale: configs.LOCALE,
            redirect_uri: 'http://localhost:8080/',
            form: 'forgotPasswordForm'
        });

        const request = axios.post(reqUrl, data);

        request.then(response => {
            res.json(response.data);
        }).catch(error => {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });

    },
    resetPassword: (req, res) => {

        const {code, newPassword, newPasswordConfirm} = req.body;

        const reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/update_profile_native";

        exchangeCodeToToken(code, (err, access_token) => {

            if (err) {
                return res.json(err);
            }

            const data = {
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

            const request = axios.post(reqUrl, data);

            request.then(response => {

                if (response.data.stat === "ok") {
                    return res.json({
                        stat: "ok",
                        msg: "Your password was set successfully.",
                    });
                }

                let respJson = {
                    stat: "error",
                    msg: "Something went wrong."
                };

                if (response.data.invalid_fields) {
                    respJson = extend(respJson, {
                        invalidFields: response.data.invalid_fields
                    })
                }

                res.json(respJson);

            }).catch(error => {
                res.status(500).send({
                    success: false,
                    msg: "Internal server error"
                });
            });

        });

    },
    verifyEmail: (req, res) => {

        const {verificationCode} = req.body;

        if (!verificationCode) {
            return res.status(400).send({
                success: false,
                msg: 'No verification code provided.'
            });
        }

        const reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/access/useVerificationCode?verification_code=" + verificationCode;

        const request = axios.get(reqUrl);

        return request.then(response => {
            res.json(response.data);
        }).catch(error => {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });
    },
    updateUser: (req, res) => {

        const {body} = req;

        const accessToken = req.get('authToken');

        const reqUrl = "https://" + configs.APP_DOMAIN + ".janraincapture.com/oauth/update_profile_native";

        const data = extend(body, {
            client_id: configs.CLIENT_ID,
            flow: configs.FLOW,
            flow_version: configs.FORGOT_PASSWORD_FLOW_VERSION,
            locale: configs.LOCALE,
            redirect_uri: 'http://localhost:8080/',
            form: 'editProfileForm',
            access_token: accessToken
        });

        const request = axios.post(reqUrl, data);

        request.then(response => {
            res.json(response.data);
        }).catch(error => {
            res.status(500).send({
                success: false,
                msg: "Internal server error"
            });
        });

    }

};