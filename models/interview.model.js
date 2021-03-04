const sequelize = require('../database/connection');
const {DataTypes} = require('sequelize');
const Interviewee = require('./interviewee.model');


const Interview = sequelize.define(
	'Interview',
	{
        interviewID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		panelID:  DataTypes.INTEGER ,
        intervieweeID: DataTypes.TEXT,
        date: DataTypes.DATEONLY,
        time: DataTypes.TIME,
        state: {
            type: DataTypes.ENUM,
            values: ['Not Started','Ongoing','Completed']
        },
        feedback: DataTypes.TEXT
	},
	{ freezeTableName: true, timestamps: false }
);

Interview.belongsTo(Interviewee,{foreignKey:"intervieweeID"})


module.exports = Interview;