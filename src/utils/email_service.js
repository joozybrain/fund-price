let nodemailer = require("nodemailer");
let mailgunTransport = require("nodemailer-mailgun-transport");

//const { mailgunAPIKey, mailgunDomain } = require("../config");

const mailgunOptions = {
  auth: {
    api_key: "key-c5f09983ba253b0a05bc7e021b5f16d6",
    domain: "sandbox4603350373c64abe86f426cde4d6ff30.mailgun.org"
  }
};

const transport = mailgunTransport(mailgunOptions);

class EmailService {
  constructor() {
    this.emailClient = nodemailer.createTransport(transport);
  }
  sendText(from, to, subject, text) {
    return new Promise((resolve, reject) => {
      this.emailClient.sendMail(
        {
          from,
          to,
          subject,
          text
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });
  }
}

module.exports = new EmailService();
