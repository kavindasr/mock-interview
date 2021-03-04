const sequelize = require('../database/connection');
const {DataTypes} = require('sequelize')
const Panel = require('./panel.model')
const VolunteerPanel = sequelize.define(
	'VolunteerPanel',
	{
		panelID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		volunteerID: {type:DataTypes.TEXT, primaryKey:true}
	},
	{ freezeTableName: true, timestamps: false }
);

VolunteerPanel.belongsTo(Panel,{foreignKey:'panelID'})

module.exports = VolunteerPanel;