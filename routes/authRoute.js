const router = require('express').Router();

const { authorized, authenticated } = require('../middleware/auth-middleware');

const {
	register,
	login,
	changePassword,
	forgotPassword,
	verify,
	resetPassword,
} = require('../controllers/authController');

const { validationRules, validate } = require('../validations/user-validator');

const {
	validationRules: passwordValidationRules,
	validate: passwordValidate,
} = require('../validations/change-password-validator');

router.post('/login', async (req, res) => {
	/*  #swagger.tags = ['Auth']
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/LoginModel" }
    } */
	await login(req.body, res);
});

router.post('/register', validationRules(), validate, async (req, res) => {
	/*
	  #swagger.tags = ['Auth']
	  #swagger.parameters['obj'] = {
	       in: 'body',
	       required:true,
	       schema:{$ref:'#/definitions/RegisterModel'}
	  }
	 */
	await register(req.body, 'user', res);
});

router.post('/verify', async (req, res) => {
	/*  #swagger.tags = ['Auth']
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/VerifyEmailModel" }
    } */
	await verify(req.body, res);
});
router.post('/forgot-password', async (req, res) => {
	/*  #swagger.tags = ['Auth']
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/ForgotPassWordModel" }
    } */
	await forgotPassword(req.body, res);
});

router.post('/reset-password', async (req, res) => {
	/*  #swagger.tags = ['Auth']
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/ResetPasswordModel" }
    } */
	await resetPassword(req.body, res);
});
router.post('/change-password', authenticated, async (req, res) => {
	/*  #swagger.tags = ['Auth']
        #swagger.security = [{
        "Authorization": []
        }]
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/ChangePasswordModel" }
    } */

	await changePassword(req.body, res);
});

module.exports = router;
