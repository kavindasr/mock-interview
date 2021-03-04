const Sequelize = require("sequelize");
const config = require('../config/config')
const sequelize = new Sequelize(config.db.dbName, config.db.user,config.db.password,{
    host:config.db.host,
    dialect: "mysql",
    port: config.db.port

});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
