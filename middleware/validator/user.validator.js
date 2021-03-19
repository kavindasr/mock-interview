const Joi = require('joi');
const {USER_TYPES} = require('../../util/constants')
const {validator, validatorWithParam} = require('./validator')
const userRequiredFields = ['name', 'email', 'contactNo', 'role']

const updateUserSchema = Joi.object().keys({
	id: Joi.number().integer().greater(0),
	name: Joi.string().max(100),
	email: Joi.string().max(40),
	contactNo: Joi.string()
		.length(10)
		.pattern(/^[0-9]+$/),
	role: Joi.string().max(20).valid(...USER_TYPES),
});

const createUserSchema = updateUserSchema.fork(
	userRequiredFields,
	(field) => field.required()
);

const changePasswordSchema = Joi.object().keys({
	id: Joi.number().integer().greater(0),
    newPassword: Joi.string().max(10).required(),
    confirmNewPassword: Joi.string().required().valid(Joi.ref('password')),
}) 



exports.validateUserPost = validator(createUserSchema)

exports.validateUserPut = validatorWithParam(updateUserSchema, 'id')

exports.validateChangePassword = validatorWithParam(changePasswordSchema, 'id')
