const Joi = require('joi');
const {validator, validatorWithParam} = require('./validator')
const companyAttributes = ['companyName', 'email', 'contactNo']

const updateCompanySchema = Joi.object().keys({
    companyID: Joi.number().integer().greater(0),
	companyName: Joi.string().max(50),
	email: Joi.string().email().max(40),
	contactNo: Joi.string()
		.length(10)
		.pattern(/^[0-9]+$/),
});

const createCompanySchema = updateCompanySchema.fork(
	companyAttributes,
	(field) => field.required()
);


exports.validateCompanyPost = validator(createCompanySchema)

exports.validateCompanyPut = validatorWithParam(updateCompanySchema, 'companyID')


