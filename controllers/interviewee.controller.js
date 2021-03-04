const Interviewee = require("../models/interviewee.model");
const converter = require('../util/converter')

/**
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getInterviewees = async (req, res) => {
  let interviewees = [];
  try {
    interviewees = await Interviewee.findAll();
    interviewees = interviewees.map(item => converter(item.dataValues))
    return res.status(200).send(interviewees);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

/**
 *@returns Array<{officerID, name, role, stationID, stationName, location, type, contactNo}>
 */
exports.getInterviewee = async (req, res) => {
  let interviewee = {};
  try {
    interviewee = await Interviewee.findOne({where:{intervieweeID:req.params.intervieweeID}});
    interviewee =  converter(interviewee.dataValues)
    return res.status(200).send(interviewee);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};


/**
 * @description Auto generates a password and send it to Interviewees mail
 *@returns Object
 */
exports.createInterviewee = async (req, res) => {
  let interviewee = req.body;
  try {
    interviewee = await Interviewee.create(req.body);
    interviewee = converter(interviewee.dataValues);
    let io = req.app.get('socket');
		io.in("admin").emit('interviewee','post',interviewee);
    return res.status(200).send(interviewee);
  } catch (e) {
    return res.status(400).send({ status: 400, message: e.message });
  }
};

/**
 * @param {Object} req: req.body: Any attribute of interviewee
 *@returns {Object}
 */

exports.updateInterviewee = async (req, res) => {
  let interviewee = {};
  try {
    interviewee = await Interviewee.update(
      req.body,
      { where: { intervieweeID: req.params.intervieweeID }, returning: true }
    );
    interviewee = await Interviewee.findOne({
      where: { intervieweeID: req.params.intervieweeID },
    });
    interviewee = converter(interviewee.dataValues)
    let io = req.app.get('socket');
		io.in("admin").emit('interviewee','put',interviewee);
		io.in("volunteer").emit('interviewee','put',interviewee);
    return res.status(200).send(interviewee);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

exports.updateIntervieweeVolunteer = async (req, res) => {
  let interviewee = {};
  try {
    interviewee = await Interviewee.update(
      {availability: req.body.availability},
      { where: { intervieweeID: req.params.intervieweeID }, returning: true }
    );
    interviewee = await Interviewee.findOne({
      where: { intervieweeID: req.params.intervieweeID },
    });
    interviewee = converter(interviewee.dataValues)
    let io = req.app.get('socket');
		io.in("admin").emit('interviewee','put',interviewee);
		io.in("volunteer").emit('interviewee','put',interviewee);
		io.in("panel").emit('interviewee','put',interviewee);
    return res.status(200).send(interviewee);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};
/**
 * @returns success or error message
 */
exports.deleteInterviewee = async (req, res) => {
  try {
    await Interviewee.destroy({ where: { intervieweeID: req.params.intervieweeID } });
    let io = req.app.get('socket');
		io.in("admin").emit('interviewee','delete',{id:req.params.intervieweeID});
		io.in("admin").emit('volunteer','delete',{id:req.params.intervieweeID});
		io.in("admin").emit('panel','delete',{id:req.params.intervieweeID});
    return res.status(200).send("Interviewee succesfully deleted");
  } catch (e) {
    return res.status(400).send(e.message);
  }
};
