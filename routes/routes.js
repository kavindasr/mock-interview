module.exports = (app) => {
	app.use('/users', require('./user'));
	app.use('/company', require('./company'));
	app.use('/panel', require('./panel'));
	app.use('/interviewee', require('./interviewee'));
	app.use('/interview', require('./interview'));
};
