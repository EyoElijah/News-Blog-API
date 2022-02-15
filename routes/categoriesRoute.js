const router = require('express').Router();

const { authorized, authenticated } = require('../middleware/auth-middleware');
const {
	validationRules,
	validate,
} = require('../validations/category-validator');
const {
	addCategory,
	removeCategory,
	updateCategory,
	singleCategory,
	allCategory,
} = require('../controllers/categoriesController');

router.get('/categories', async (req, res) => {
	// #swagger.tags = ['Posts']
	await allCategory(req, res);
});

router.post(
	'/categories',
	authenticated,
	authorized(['admin']),
	validationRules(),
	validate,
	async (req, res) => {
		/*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/CategoryModel" }
    } */
		await addCategory(req, res);
	}
);

router.put(
	'/categories/:id  ',
	authenticated,
	authorized(['admin']),
	validationRules(),
	validate,
	async (req, res) => {
		/*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/CategoryModel" }
    } */
		await updateCategory(req, res);
	}
);

router.get('/categories/:id  ', async (req, res) => {
	// #swagger.tags = ['Posts']
	await singleCategory(req, res);
});

router.delete(
	'/categories/:id  ',
	authenticated,
	authorized(['admin']),
	async (req, res) => {
		/*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    */
		await removeCategory(req, res);
	}
);

module.exports = router;
