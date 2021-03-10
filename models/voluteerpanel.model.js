const sequelize = require('../database/connection');
const {DataTypes} = require('sequelize')
const Panel = require('./panel.model')
const User = require('./user.model')
const VolunteerPanel = sequelize.define(
	'VolunteerPanel',
	{
		panelID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		volunteerID: {type:DataTypes.TEXT, primaryKey:true}
	},
	{ freezeTableName: true, timestamps: false }
);

VolunteerPanel.belongsTo(Panel,{foreignKey:'panelID'})
VolunteerPanel.belongsTo(User,{foreignKey:'volunteerID'})

module.exports = VolunteerPanel;