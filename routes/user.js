const express = require('express');
const UserController = require('../controllers/user.controller');
const { authorize } = require('../middleware/authorize');
const {validateUserPost, validateUserPut, validateChangePassword} = require('../middleware/validator/user.validator')
const {validatorParam} =require('../middleware/validator/validator');
const { ADMINPANEL } = require('../util/constants');
const router = express.Router();

/**
 * @description get all users
 */
router.get('/', authorize() , UserController.getUsers);

/**
 * @description get a user
 */
router.get('/:id', validatorParam, UserController.getUser);

/**

/**
 * @description get all volunteers
 */
router.get('/volunteer', authorize(), UserController.getVolunteers);

/**
 * @description get the volunteer assigned to panel
 */
router.get('/volunteer/:panelID', authorize(ADMINPANEL), validatorParam, UserController.getVolunteerOfPanel);

/**

/**
 * @description update user
 */
router.put('/:id', authorize(),validatorParam,validateUserPut, UserController.updateUser);

/**
 * @description create user
 */
router.post('/',authorize(),validateUserPost ,UserController.createUser);


/**
 * @description delete user
 */
router.delete('/:id', authorize(),validatorParam, UserController.deleteUser);

/**
 * @description change the password of the user
 */
router.post('/changePassword/:id', authorize(),validatorParam, UserController.changePassword);



router.all('*', (req, res) => {
	res.status(404).json({ status: 404, message: 'Not found' });
});

module.exports = router;
