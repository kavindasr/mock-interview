const Panel = require('../models/panel.model');
const User = require('../models/user.model');
const sequelize = require('../database/connection');
const VolunteerPanel = require('../models/voluteerpanel.model');
const bcrypt = require('bcryptjs');
var generator = require('generate-password');
const converter = require('../util/converter');
const sendMail = require('../services/mailer');
const Company = require('../models/company.model');
const sendToAdminVolunteerPanel = require('../util/websockethelper');
/**
 * make this to get volunteer details also
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getPanels = async (req, res) => {
	let panels = [];
	try {
		panels = await Panel.findAll({
			where: { companyID: req.params.companyID },
			include: { model: User, attributes: { exclude: ['password'] } },
		});
		panels = panels.map((item) => converter(item.dataValues));
		return res.status(200).send(panels);
	} catch (e) {
		return res.status(400).send(e.message);
	}
};

/**
 * make this to get volunteer details also
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getAllPanels = async (req, res) => {
	let panels = [];
	try {
		panels = await VolunteerPanel.findAll({
			include: { model: Panel, right: true, include: { model: User, attributes: { exclude: ['password'] } } },
		});

		panels = panels.map((item) => converter(item.dataValues));
		return res.status(200).send(panels);
	} catch (e) {
		return res.status(400).send(e.message);
	}
};

/**
 * make this to get volunteer details also
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getPanel = async (req, res) => {
	let panel = {};
	try {
		panel = await Panel.findOne({
			where: { panelID: req.params.panelID },
			include: [{ model: User, attributes: { exclude: ['password'] } }, { model: Company }],
		});
		if (panel) {
			if (panel.hasOwnProperty('dataValues')) {
				panel = converter(panel.dataValues);
			}
		}
		return res.status(200).send(panel);
	} catch (e) {
		return res.status(400).send(e.message);
	}
};

/**
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getVolunteerPanels = async (req, res) => {
	let panels = [];
	try {
		panels = await VolunteerPanel.findAll({
			where: { volunteerID: req.params.volunteerID },
			include: { model: Panel, include: { model: User } },
		});
		panels = panels.map((item) => converter(item.dataValues));
		return res.status(200).send(panels);
	} catch (e) {
		return res.status(400).send(e.message);
	}
};

/**
 * @description Auto generates a password and send it to Panels mail
 *@returns Object
 */
exports.createPanel = async (req, res) => {
	let panel = {};
	let user = req.body;
	let volunteer = [];
	let password = '';
	let t = await sequelize.transaction();
	try {
		password = generator.generate({
			length: 10,
			numbers: true,
		});
		console.log(password);
		let salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		user = await User.create({ ...user, role: 'Panel' }, { transaction: t });
		let id = user.id;
		panel = await Panel.create({ ...req.body, userID: id, needHelp: 0 }, { transaction: t });
		if (req.body.hasOwnProperty('Volunteer')) {
			req.body.Volunteer = req.body.Volunteer.map((item) => {
				return { ...item, panelID: panel.panelID };
			});
			volunteer = await VolunteerPanel.bulkCreate(req.body.Volunteer, {
				transaction: t,
			});
		}
		await sendMail('IEEE Mock Interview Account', password, user.email);

		await t.commit();

		volunteer = volunteer.map((item) => converter(item.dataValues));
		if (user.hasOwnProperty('dataValues')) {
			user = converter(user.dataValues);
		}
		delete user.password;
		if (panel.hasOwnProperty('dataValues')) {
			panel = converter(panel.dataValues);
		}
		panel = { ...panel, ...user };
		panel.Volunteer = volunteer;
		let io = req.app.get('socket');
		io.in('admin').emit('panel', 'post', panel);
		return res.status(200).send(panel);
	} catch (e) {
		await t.rollback();
		return res.status(400).send({ status: 400, message: e.message });
	}
};

/**
 * @param {Object} req: req.body: Any attribute excluding password
 *@returns Object{officerID, name, role, stationID, stationName, location, type, contactNo}
 */

exports.updatePanel = async (req, res) => {
	let panel = {};
	let volunteer = [];
	let t = await sequelize.transaction();
	try {
		panel = await Panel.update(req.body, {
			where: { panelID: req.params.panelID },
			returning: true,
			transaction: t,
		});
		if (req.body.hasOwnProperty('Volunteer')) {
			volunteer = await VolunteerPanel.bulkCreate(req.body.Volunteer, {
				ignoreDuplicates: true,
				transaction: t,
			});
		}
		await t.commit();
		panel = await Panel.findOne({ where: { panelID: req.params.panelID } });
		console.log(panel);
		if (panel.hasOwnProperty('dataValues')) {
			panel = converter(panel.dataValues);
		}
		let io = req.app.get('socket');
		io.in('admin').emit('panel', 'put', panel);
		return res.status(200).send(panel);
	} catch (e) {
		await t.rollback();
		return res.status(400).send(e.message);
	}
};

exports.setNeedHelp = async (req, res) => {
	try {
		await Panel.update(
			{ needHelp: req.body.needHelp },
			{
				where: { panelID: req.params.panelID },
			}
		);
		let io = req.app.get('socket');
		// sendToAdminVolunteerPanel(io,'Help','update',{},req.params.panelID)
		return res.status(200).send('Help message sent');
	} catch (e) {
		return res.status(400).send(e.message);
	}
};
/**
 * @returns success or error message
 */
exports.deletePanel = async (req, res) => {
	try {
		await Panel.destroy({ where: { panelID: req.params.panelID } });
		let io = req.app.get('socket');
		io.in('admin').emit('panel', 'delete', { id: req.params.panelID });
		return res.status(200).send('Panel succesfully deleted');
	} catch (e) {
		return res.status(400).send(e.message);
	}
};
