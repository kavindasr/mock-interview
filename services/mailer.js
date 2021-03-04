const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const config  = require('../config/config')

const service = "gmail";
const clientMail = config.mail.mail;

console.log(clientMail);
const oAuth2Client = new google.auth.OAuth2(
    config.mail.clinetID,
    config.mail.clientSecret,
    config.mail.redirectUri
);

oAuth2Client.setCredentials({ refresh_token: config.mail.refreshToken });

const sendMail = async (subject, text, to) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
          service: service,
          auth: {
            type: "OAuth2",
            user: clientMail,
            clientId: config.mail.clinetID,
            clientSecret: config.mail.clientSecret,
            refreshToken: config.mail.refreshToken,
            accessToken: accessToken,
          },
          tls: {
            rejectUnauthorized: false
        }
        });
    
        const mailOptions = {
          from: 'IEEE Mock Interview',
          to,
          subject,
          text: subject,
          html: text,
        };
    
        const result = await transport.sendMail(mailOptions);
        return result;
        
      } catch (error) {
        return error;
      }
}

module.exports = sendMail;
