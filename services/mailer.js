const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('../config/config');
const hbs = require('nodemailer-express-handlebars');
var path = require('path');

const service = 'gmail';
const clientMail = config.mail.mail;

const options = {
	viewEngine: {
		layoutsDir: path.join(__dirname, '../views/layouts'),
		extName: '.handlebars',
		defaultLayout: false,
	},
	viewPath: path.join(__dirname, '../views/layouts'),
};

console.log(__dirname);
const oAuth2Client = new google.auth.OAuth2(config.mail.clinetID, config.mail.clientSecret, config.mail.redirectUri);

oAuth2Client.setCredentials({ refresh_token: config.mail.refreshToken });

const sendMail = async (subject, text, to, obj) => {
	try {
		const accessToken = await oAuth2Client.getAccessToken();
		const transport = nodemailer.createTransport({
			service: service,
			auth: {
				type: 'OAuth2',
				user: clientMail,
				clientId: config.mail.clinetID,
				clientSecret: config.mail.clientSecret,
				refreshToken: config.mail.refreshToken,
				accessToken: accessToken,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		transport.use('compile', hbs(options));

		const mailOptions = {
			from: 'IEEE Mock Interview',
			to,
			subject,
			template: 'credentials',
			context: obj,
			attachments: [
				{
					filename: 'Rise Up Mora Logo.png',
					path: path.join(__dirname, '../img/Rise Up Mora Logo.png'),
					cid: 'riseupmora',
				},
				{
					filename: 'IEEE STUDENT B LOGO.png.png',
					path: path.join(__dirname, '../img/IEEE STUDENT B LOGO.png'),
					cid: 'ieelogo',
				},
			],
		};

		const result = await transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
};

module.exports = sendMail;
