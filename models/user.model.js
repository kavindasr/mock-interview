const sequelize = require('../database/connection');
const {DataTypes} = require('sequelize')


const User = sequelize.define(
	'User',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: DataTypes.TEXT,
		email:{ type:DataTypes.TEXT, unique:true},
		password: DataTypes.TEXT,
		role: DataTypes.TEXT,
        contactNo: DataTypes.TEXT,
        img: DataTypes.TEXT
	},
	{ freezeTableName: true, timestamps: false }
);


module.exports = User;