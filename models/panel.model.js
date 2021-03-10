const sequelize = require('../database/connection');
const {DataTypes} = require('sequelize')
const User = require('./user.model');
const Company = require('./company.model');
// const VolunteerPanel = require('./voluteerpanel.model');
const Panel = sequelize.define(
	'Panel',
	{
		panelID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
		userID: DataTypes.INTEGER,
		companyID:  DataTypes.INTEGER,
		link: DataTypes.TEXT,
		needHelp: DataTypes.BOOLEAN
	},
	{ freezeTableName: true, timestamps: false }
);

Panel.belongsTo(User,{foreignKey:'userID'})
Panel.belongsTo(Company,{foreignKey:'companyID'})
// Panel.hasMany(VolunteerPanel,{foreignKey:'panelID'})
module.exports = Panel;


