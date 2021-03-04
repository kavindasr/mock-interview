const express = require('express');
const PanelController = require('../controllers/panel.controller')
const {validatePanelPost, validatePanelPut} = require('../middleware/validator/panel.validator')
const {authorize} = require('../middleware/authorize');
const { ADMINVOL } = require('../util/constants');
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
router.get('/:panelID',authorize(), PanelController.getPanel);

/**
 * @description update panel
 */
router.put('/:panelID', authorize(), validatePanelPut, PanelController.updatePanel);

/**
 * @description delete company
 */
router.delete('/:panelID', authorize(), PanelController.deletePanel);


/**
 * @description get the panels assigned to a volunteer
 */
router.get('/volunteer/:volunteerID', authorize(ADMINVOL), PanelController.getVolunteerPanels);


router.all('*', (req, res) => {
	res.status(404).json({ status: 404, message: 'Not found' });
});

module.exports = router;
