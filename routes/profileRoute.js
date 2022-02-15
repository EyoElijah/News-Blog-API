const router = require('express').Router();

const { authenticated } = require('../middleware/auth-middleware');
const { updateUser, singleUser } = require('../controllers/profileController');
const {
	validationRules,
	validate,
} = require('../validations/update-user-validator');

router.get('/profile', authenticated, async (req, res) => {
	/*  #swagger.tags = ['Profile']
        #swagger.security = [{
        "Authorization": []
        }]
    */
	await singleUser(req, res);
});

router.put(
	'/profile/  ',
	authenticated,
	validationRules(),
	validate,
	async (req, res) => {
		/*  #swagger.tags = ['Profile']
        #swagger.security = [{
        "Authorization": []
        }]
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/UpdateUserModel" }
    } */

		await updateUser(req, res);
	}
);

module.exports = router;
