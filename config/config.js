require("dotenv").config();
const config = {
  db: {
    dbuser: process.env.USER,
    host: process.env.HOST,
    port: process.env.DBPORT,
    dbName: process.env.DATABASE,
    password: process.env.PASSWORD,
  },
  mail:{
    clinetID: process.env.CLIENT_ID,
    clientSecret: process.env.CLEINT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken: process.env.REFRESH_TOKEN,
    mail: process.env.MAIL,
  },
  jsonwebtoken:process.env.JWT_SECRET
};


module.exports = config;
