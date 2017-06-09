"use strict";

var sendgrid = require("sendgrid");
var helper = sendgrid.mail;
var sendgridConfigs = require("../configs/sendgrid");

module.exports = {

    //contactSalesRepresentative: (fromail, toemail , message) => {
    contactSalesRepresentative: function contactSalesRepresentative(mailObj, callback) {
        //const {email, message} = req.body;

        var invalidFields = {};

        var errorAvailable = false;

        if (!mailObj.tomail) {
            invalidFields.toemail = ["Email is required."];
            errorAvailable = true;
        }
        if (!mailObj.message) {
            invalidFields.message = ["Message is required."];
            errorAvailable = true;
        }

        if (errorAvailable) {
            callback(invalidFields, null);
        }

        var fromEmail = mailObj.fromail ? new helper.Email(mailObj.fromail.toString()) : new helper.Email(process.env.FROM_MAIL.toString());
        var toEmail = new helper.Email(mailObj.tomail);
        var subject = mailObj.subject.toString();
        var content = new helper.Content("text/plain", mailObj.message.toString());
        var mail = new helper.Mail(fromEmail, subject, toEmail, content);
        if (mailObj.ccmail) mail.personalizations[0].addCc(new helper.Email(mailObj.ccmail));

        var sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function (error, response) {
            if (!error) {
                callback(error, null);
            } else callback(null, 'Done');
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