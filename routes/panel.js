const express = require('express');
const PanelController = require('../controllers/panel.controller')
const {validatePanelPost, validatePanelPut} = require('../middleware/validator/panel.validator')
const {authorize} = require('../middleware/authorize');
const { ADMINVOL, USER_TYPES } = require('../util/constants');
const {validatorParam} =require('../middleware/validator/validator')
const router = express.Router();

/**
 * @description get all panels 
 */
router.get('/', authorize() ,PanelController.getAllPanels);

/**
 * @description create a panel
 */
router.post('/', authorize(), validatePanelPost, PanelController.createPanel);

/**
 * @description get all panels of a company
 */
router.get('/:panelID',authorize(ADMINPANEL), validatorParam, PanelController.getPanel);

/**
 * @description update panel
 */
router.put('/:panelID', authorize(), validatorParam, validatePanelPut, PanelController.updatePanel);

/**
 * @description update need Help
 */
router.put('/needHelp/:panelID', authorize(USER_TYPES), validatorParam, validatePanelPut, PanelController.setNeedHelp);

/**
 * @description delete company
 */
router.delete('/:panelID', authorize(),validatorParam, PanelController.deletePanel);


/**
 * @description get the panels assigned to a volunteer
 */
router.get('/volunteer/:volunteerID', authorize(ADMINVOL), validatorParam, PanelController.getVolunteerPanels);


router.all('*', (req, res) => {
	res.status(404).json({ status: 404, message: 'Not found' });
});

module.exports = router;
