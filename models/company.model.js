const sequelize = require('../database/connection');
const {DataTypes} = require('sequelize')


const Company = sequelize.define(
	'Company',
	{
		companyID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		companyName: DataTypes.TEXT,
		email:{ type:DataTypes.TEXT, unique:true},
        contactNo: DataTypes.TEXT,
        logo: DataTypes.TEXT
	},
	{ freezeTableName: true, timestamps: false }
);


module.exports = Company;



