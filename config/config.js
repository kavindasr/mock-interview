require("dotenv").config();
const config = {
  db: {
    dbuser: "admin",
    host: "ieee-mock-interview.c90hbp9gmghy.us-east-2.rds.amazonaws.com",
    port: "3306",
    dbName: "MockInterview",
    password:"jv0hZnS3IjIwqsaYNyPZ",
  },
  mail:{
    clinetID: process.env.CLIENT_ID,
    clientSecret: process.env.CLEINT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken: process.env.REFRESH_TOKEN,
    mail: process.env.MAIL,
  }
};


module.exports = config;
