const Joi = require('joi');

exports.validator = (schema) => (req, res, next) => {
	let { error } = schema.validate(req.body);
	if (error != undefined) {
		return res.status(422).send(error.details[0].message);
	} else {
		next();
	}
};

exports.validatorWithParam = (schema, paramType) => (req, res, next) => {
	let validateObj = req.body;
	validateObj[paramType] = req.params[paramType];
	let { error } = schema.validate(req.body);
	if (error != undefined) {
		return res.status(422).send(error.details[0].message);
	} else {
		next();
	}
};

exports.validatorParam = (req, res, next) => {
	let paramTypes = Object.values(req.params)
	let error = false
	for(let i =0; i< paramTypes.length; i++){
		let number = parseInt(paramTypes[i])
		error = !(Number.isInteger(number) && number > 0)
		if(error){
			break;
		}
	}
	if(error){
		return res.status(422).send('Invalid parameters')
	}
	else{
		next();
	}
};
