const Joi = require('joi');

exports.validator = (schema) => (req, res, next) => {
	let { error } = schema.validate(req.body);
	if (error != undefined) {
		return res.status(500).send(error.details[0].message);
	} else {
		next();
	}
};

exports.validatorWithParam = (schema, paramType) => (req, res, next) => {
	let validateObj = req.body;
	validateObj[paramType] = req.params[paramType];
	let { error } = schema.validate(req.body);
	if (error != undefined) {
		return res.status(500).send(error.details[0].message);
	} else {
		next();
	}
};
