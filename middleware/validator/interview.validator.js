const Joi = require('joi');
const {INTERVIEW_STATES} = require('../../util/constants')
const {validator, validatorWithParam} = require('./validator')

const interviewRequiredFields = ['panelID', 'intervieweeID']

const updateInterviewSchema = Joi.object().keys({
	interviewID: Joi.number().integer().greater(0),
    panelID: Joi.number().integer(),
    intervieweeID: Joi.number().integer(),
	state: Joi.string().max(20).valid(...INTERVIEW_STATES),
	feedback: Joi.string().max(200),
});

const createInterviewSchema = updateInterviewSchema.fork(
	interviewRequiredFields,
	(field) => field.required()
);

exports.validateInterviewPost = validator(createInterviewSchema);

exports.validateInterviewPut = validatorWithParam(updateInterviewSchema,'interviewID');

