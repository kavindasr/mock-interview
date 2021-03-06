const express = require('express');
const IntervieweeController = require('../controllers/interviewee.controller')
const { ADMINVOL, ADMINPANEL} = require('../util/constants')
const {authorize} = require('../middleware/authorize')
const {validatorParam} =require('../middleware/validator/validator')
const {validateIntervieweePost, validateIntervieweePut} = require('../middleware/validator/interviewee.validator')
const router = express.Router();

/**
 * @description get all Interviewees
 */
router.get('/', authorize(ADMINVOL), IntervieweeController.getInterviewees);

/**
 * @description get all Interviewees
 */
router.get('/:intervieweeID', authorize(ADMINPANEL), validatorParam, IntervieweeController.getInterviewee);

/**
 * @description create Interviewee
 */
router.post('/', authorize(ADMINVOL), validateIntervieweePost, IntervieweeController.createInterviewee);


/**
 * @description update Interviewee
 */

router.put('/:intervieweeID', authorize(ADMINVOL), validatorParam, validateIntervieweePut, IntervieweeController.updateInterviewee);



/**
 * @description delete Interviewee
 */
router.delete('/:intervieweeID', authorize(), validatorParam, IntervieweeController.deleteInterviewee);


/**
 * @description update Interviewee
 */
router.put('/volunteer/:intervieweeID', authorize(ADMINVOL), validatorParam, validateIntervieweePut ,IntervieweeController.updateIntervieweeVolunteer);


router.all('*', (req, res) => {
	res.status(404).json({ status: 404, message: 'Not found' });
});

module.exports = router;
