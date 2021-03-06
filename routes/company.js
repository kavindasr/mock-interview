const express = require('express');
const CompanyController = require('../controllers/company.controller')
const {validateCompanyPost, validateCompanyPut} = require('../middleware/validator/company.validator')
const {authorize} = require('../middleware/authorize');
const {validatorParam} =require('../middleware/validator/validator')
const router = express.Router();

/**
 * @description get all companies
 */
router.get('/', authorize(), CompanyController.getCompanies);


/**
 * @description update company
 */
router.put('/:companyID',authorize(),validatorParam, validateCompanyPut ,CompanyController.updateCompany);

/**
 * @description create company
 */
router.post('/' ,authorize(),validateCompanyPost, CompanyController.createCompany);


/**
 * @description delete company
 */
router.delete('/:companyID', authorize(), validatorParam,CompanyController.deleteCompany);

/**
 * @description change the password of the user
 */
// router.post('/changePassword/:userId', UserController.changePassword);


router.all('*', (req, res) => {
	res.status(404).json({ status: 404, message: 'Not found' });
});

module.exports = router;
