"use strict";

var sendgrid = require("sendgrid");
var helper = sendgrid.mail;
var sendgridConfigs = require("../configs/sendgrid");

module.exports = {

    contactSalesRepresentative: function contactSalesRepresentative(fromail, toemail, message) {

        //const {email, message} = req.body;

        var invalidFields = {};

        var errorAvailable = false;

        if (!toemail) {
            invalidFields.toemail = ["Email is required."];
            errorAvailable = true;
        }
        if (!message) {
            invalidFields.message = ["Message is required."];
            errorAvailable = true;
        }

        if (errorAvailable) {
            return res.json({
                stat: "error",
                invalidFields: invalidFields
            });
        }

        var from_email = fromail ? new helper.Email(fromail) : new helper.Email("oluminatsd@olumiantmaster.com");
        var to_email = new helper.Email(toemail);
        var subject = "Sales Representative contact request from " + toemail;
        var content = new helper.Content("text/plain", message);
        var mail = new helper.Mail(from_email, subject, to_email, content);
        var sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function (error, response) {
            if (!error) {
                console.log(response);
            }

            console.log(error);
        });
    },
    createContactList: function createContactList(req, res) {

        var sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);

        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/contactdb/lists',
            body: {
                "name": "sdContactsList"
            }
        });

        sg.API(request, function (error, response) {

            if (!error) {
                res.status(response.statusCode).send({
                    success: true,
                    msg: "createContactList"
                });
            }

            res.status(500).send({
                success: false,
                msg: "Something went wrong."
            });
        });
    },
    addContactToList: function addContactToList(req, res) {
        var email = req.body.email;


        if (!email) {
            return res.status(400).send({
                success: false,
                msg: "All fields are required."
            });
        }

        var addRecipient = function addRecipient(email, cb) {
            var sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);

            var body = [{
                "email": email
            }];

            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/contactdb/recipients',
                body: body
            });

            sg.API(request, function (error, response) {
                if (!error) {
                    return cb(null, response);
                }
                cb(error);
            });
        };

        addRecipient(email, function (err, recipient) {

            if (!err) {
                var recipientId = recipient.body.persisted_recipients[0];

                var sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);

                var request = sg.emptyRequest({
                    method: 'POST',
                    path: "/v3/contactdb/lists/1067351/recipients/" + recipientId,
                    body: 'null'
                });

                sg.API(request, function (error, response) {

                    if (!error) {
                        return res.status(response.statusCode).send({
                            success: true,
                            msg: "addContactToList"
                        });
                    }

                    res.status(500).send({
                        success: false,
                        msg: "Something went wrong."
                    });
                });
            } else {
                res.status(500).send({
                    success: false,
                    msg: "Something went wrong."
                });
            }
        });
    }

};