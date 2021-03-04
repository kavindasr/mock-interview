const express = require('express');
const InterviewController = require('../controllers/interview.controller')
const {validateInterviewPost,validateInterviewPut} = require('../middleware/validator/interview.validator')
const { ADMINVOL, ADMINPANEL} = require('../util/constants')
const {authorize} = require('../middleware/authorize')
const router = express.Router();


/**
 * @description get all Interviews
 */
router.get('/', authorize(), InterviewController.getInterviews);


/**
 * @description create Interview
 */
router.post('/', authorize(ADMINVOL), validateInterviewPost, InterviewController.createInterview);


/**
 * @description update Interview
 */
router.put('/:interviewID', authorize(ADMINPANEL), validateInterviewPut, InterviewController.updateInterview);


/**
 * @description delete Interview
 */
router.delete('/:interviewID', authorize(ADMINVOL), InterviewController.deleteInterview);


/**
 * @description get all Interviews pof the volunteer
 */
router.get('/volunteer/:panelID', authorize(ADMINVOL), InterviewController.getInterviewsOfAssignedPanel);


/**
 * @description get all Interviews assigned to panel
 */
router.get('/panel/:panelID', authorize(ADMINPANEL), InterviewController.getAssignedInterviews);


/**
 * @description get all Interviews
 */
router.put('/panel/:interviewID', authorize(ADMINPANEL) ,InterviewController.updateAssignedInterview);


router.all('*', (req, res) => {
	res.status(404).json({ status: 404, message: 'Not found' });
});

module.exports = router;
