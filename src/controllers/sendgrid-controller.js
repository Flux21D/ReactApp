const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const sendgridConfigs = require("../configs/sendgrid");

module.exports = {

    contactSalesRepresentative: (fromail, toemail , message) => {

        //const {email, message} = req.body;

        let invalidFields = {};

        let errorAvailable = false;

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

        const from_email = fromail ? new helper.Email(fromail) : new helper.Email("oluminatsd@olumiantmaster.com");
        const to_email = new helper.Email(toemail);
        const subject = "Sales Representative contact request from "+toemail;
        const content = new helper.Content("text/plain", message);
        const mail = new helper.Mail(from_email, subject, to_email, content);
        const sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);
        const request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, (error, response) => {
            if (!error) {
                console.log(response)
            }

            console.log(error);
        })

    },
    createContactList: (req, res) => {

        const sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);

        const request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/contactdb/lists',
            body: {
                "name": "sdContactsList"
            }
        });

        sg.API(request, (error, response) => {

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
        })
    },
    addContactToList: (req, res) => {

        const {email} = req.body;

        if (!email) {
            return res.status(400).send({
                success: false,
                msg: "All fields are required."
            });
        }

        const addRecipient = (email, cb) => {
            const sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);

            const body = [{
                "email": email
            }];

            const request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/contactdb/recipients',
                body: body
            });

            sg.API(request, (error, response) => {
                if (!error) {
                    return cb(null, response);
                }
                cb(error);
            });
        };

        addRecipient(email, (err, recipient) => {

            if (!err) {
                const recipientId = recipient.body.persisted_recipients[0];

                const sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);

                const request = sg.emptyRequest({
                    method: 'POST',
                    path: `/v3/contactdb/lists/1067351/recipients/${recipientId}`,
                    body: 'null'
                });

                sg.API(request, (error, response) => {

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

                })
            } else {
                res.status(500).send({
                    success: false,
                    msg: "Something went wrong."
                });
            }
        });
    }

};