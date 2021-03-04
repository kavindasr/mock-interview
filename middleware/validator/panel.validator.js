const Joi = require('joi');
const { USER_TYPES } = require('../../util/constants');
const { validator, validatorWithParam } = require('./validator');
const panelAttributes = ['companyID', 'name', 'email', 'contactNo'];

const updatePanelSchema = Joi.object().keys({
	id: Joi.number().integer().greater(0),
	name: Joi.string().max(100),
	email: Joi.string().email().max(40),
	contactNo: Joi.string()
		.length(10)
		.pattern(/^[0-9]+$/),
	role: Joi.string().max(20).valid('Panel'),
	img: Joi.string().max(255),
	panelID: Joi.number().integer().greater(0),
	userID: Joi.number().integer().greater(0),
	companyID: Joi.number().integer().greater(0),
	link: Joi.string().max(200),
	Volunteer: Joi.array().items({ panelID: Joi.number().integer().greater(0), volunteerID: Joi.number().integer().greater(0) }),
});

const createPanelSchema = updatePanelSchema.fork(panelAttributes, (field) => field.required());

exports.validatePanelPost = validator(createPanelSchema);

exports.validatePanelPut = validatorWithParam(updatePanelSchema, 'panelID');
