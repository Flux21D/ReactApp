const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const sendgridConfigs = require("../configs/sendgrid");

module.exports = {

    //contactSalesRepresentative: (fromail, toemail , message) => {
  contactSalesRepresentative: (mailObj,callback) => {
        //const {email, message} = req.body;

    let invalidFields = {};

    let errorAvailable = false;
        
    if (!mailObj.tomail) {
      invalidFields.toemail = ["Email is required."];
      errorAvailable = true;
    }
    if (!mailObj.message) {
      invalidFields.message = ["Message is required."];
      errorAvailable = true;
    }

    if (errorAvailable) {
      callback(invalidFields,null);
    }

    let fromEmail = mailObj.fromail ? new helper.Email(mailObj.fromail.toString()) : new helper.Email(process.env.FROM_MAIL.toString());
    let toEmail = new helper.Email(mailObj.tomail);
    let subject = mailObj.subject.toString();
    let content = new helper.Content("text/plain",mailObj.message.toString());
    let mail = new helper.Mail(fromEmail, subject, toEmail, content);
    if (mailObj.ccmail) mail.personalizations[0].addCc(new helper.Email(mailObj.ccmail));
        
    let sg = sendgrid(sendgridConfigs.SENDGRID_API_KEY);
    let request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
      if (error) {
        callback(error,null);
      }
      else
                callback(null,'Done');
    });

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