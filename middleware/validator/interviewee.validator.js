const Joi = require('joi');
const {validator, validatorWithParam} = require('./validator')

const intervieweeAttributes = ['name', 'email', 'contactNo', 'dept']

const updateIntervieweeSchema = Joi.object().keys({
    intervieweeID: Joi.number().integer().greater(0),
	name: Joi.string().max(100),
	email: Joi.string().max(50),
	contactNo: Joi.string()
		.length(10)
		.pattern(/^[0-9]+$/),
    dept: Joi.string().max(50),
	cv: Joi.string().max(200),
	availability: Joi.boolean(),
	intervieweeImg: Joi.string().allow("").min(0).max(255),
});

const createIntervieweeSchema = updateIntervieweeSchema.fork(
	intervieweeAttributes,
	(field) => field.required()
);


exports.validateIntervieweePost = validator(createIntervieweeSchema)

exports.validateIntervieweePut = validatorWithParam(updateIntervieweeSchema,'intervieweeID' )