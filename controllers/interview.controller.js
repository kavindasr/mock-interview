const sequelize = require('../database/connection');
const Interview = require('../models/interview.model');
const Interviewee = require('../models/interviewee.model');
const converter = require('../util/converter');
const sendToAdminVolunteerPanel = require('../util/websockethelper');
/**
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getInterviews = async (req, res) => {
	let interviews = [];
	try {
		interviews = await Interview.findAll();
		interviews = interviews.map((item) => converter(item.dataValues));
		return res.status(200).send(interviews);
	} catch (e) {
		return res.status(400).send(e.message);
	}
};

/**
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getInterviewsOfAssignedPanel = async (req, res) => {
	let interviews = [];
	try {
		interviews = await Interview.findAll({
			attributes: { exclude: 'feedback' },
			where: { panelID: req.params.panelID },
			include: { model: Interviewee },
		});
		interviews = interviews.map((item) => converter(item.dataValues));
		return res.status(200).send(interviews);
	} catch (e) {
		return res.status(400).send(e.message);
	}
};

/**
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getAssignedInterviews = async (req, res) => {
	let interviews = [];
	try {
		interviews = await Interview.findAll({
			where: { panelID: req.params.panelID },
			include: { model: Interviewee },
		});
		interviews = interviews.map((item) => converter(item.dataValues));
		return res.status(200).send(interviews);
	} catch (e) {
		return res.status(400).send(e.message);
	}
};

/**
 * @description Create a new interview
 * @description Socket message: Admin room,only to panel and volunteer
 *@returns Object
 */
exports.createInterview = async (req, res) => {
	let interview = req.body;
	try {
		interview = await Interview.create({ ...req.body, state: 'Not Started' });
		interview = await Interview.findOne({
			where: { interviewID: interview.interviewID },
			attributes: { exclude: 'feedback' },
			include: { model: Interviewee },
		});
		interview = converter(interview.dataValues);
		let io = req.app.get('socket');
		sendToAdminVolunteerPanel(io, 'interview', 'post', interview, interview.panelID);
		return res.status(200).send(interview);
	} catch (e) {
		return res.status(400).send({ status: 400, message: e.message });
	}
};

/**
 * @param {Object} req: req.body: Any attribute excluding password
 *@returns Object{officerID, name, role, stationID, stationName, location, type, contactNo}
 */

exports.updateInterview = async (req, res) => {
	let interview = {};
	let t = await sequelize.transaction();
	let updateVal = false;
	try {
		if (req.body.hasOwnProperty('state')) {
			interview = await Interview.findOne({
				where: { interviewID: req.params.interviewID },
			});
			updateVal = interview.state == 'Ongoing' ? false : true;
			if (interview.state == 'Not Started' && req.body.state == 'Ongoing') {
				updateVal = false;
			} else if (interview.state == 'Ongoing' && req.body.state == 'Completed') {
				updateVal = true;
			}
			interviewee = await Interviewee.update(
				{ availability: updateVal },
				{ where: { intervieweeID: req.body.intervieweeID }, returning: true, transaction: t }
			);
		}

		interview = await Interview.update(req.body, {
			where: { interviewID: req.params.interviewID },
			returning: true,
			transaction: t,
		});
		await t.commit();
		interview = await Interview.findOne({
			where: { interviewID: req.params.interviewID },
			attributes: { exclude: 'feedback' },
			include: { model: Interviewee },
		});

		interview = converter(interview.dataValues);
		interview.availability = updateVal;
		let io = req.app.get('socket');
		sendToAdminVolunteerPanel(io, 'interview', 'put', interview, interview.panelID);
		return res.status(200).send(interview);
	} catch (e) {
		await t.rollback();
		return res.status(400).send(e.message);
	}
};

/**
 * @description called by panel to assign the state of the interview and the feedback
 * @param {Object} req: req.body: with state or feedback
 *@returns {Object} interview
 */

exports.updateAssignedInterview = async (req, res) => {
	let interview = {};
	try {
		interview = await Interview.update(
			{ state: req.body.state, feedback: req.body.feedback },
			{ where: { interviewID: req.params.interviewID }, returning: true }
		);
		interview = await Interview.findOne({
			where: { interviewID: req.params.interviewID },
			include: { model: Interviewee },
		});
		interview = converter(interview.dataValues);
		let io = req.app.get('socket');
		sendToAdminVolunteerPanel(io, 'interview', 'put', interview, interview.panelID);
		return res.status(200).send(interview);
	} catch (e) {
		return res.status(400).send(e.message);
	}
};


/**
 * @returns success or error message
 */
exports.deleteInterview = async (req, res) => {
	try {
		await Interview.destroy({ where: { interviewID: req.params.interviewID } });
		let io = req.app.get('socket');
		sendToAdminVolunteerPanel(io, 'interview', 'delete', { id: req.params.interviewID }, req.body.panelID);
		return res.status(200).send('Interview succesfully deleted');
	} catch (e) {
		return res.status(400).send(e.message);
	}
};
