const router = require('express').Router();

const { authorized, authenticated } = require('../middleware/auth-middleware');

const { getAll, getOne } = require('../controllers/adminController');

const { register } = require('../controllers/authController');

router.get('/users', authenticated, authorized(['admin']), async (req, res) => {
	/**
	 *
	 * #swagger.tags = ['Admin']
	 * #swagger.security = [{
	 * 'Authorization':[]
	 * }]
	 */
	await getAll(req, res);
});

router.get(
	'/users/:id',
	authenticated,
	authorized(['admin']),
	async (req, res) => {
		/**
		 *
		 * #swagger.tags = ['Admin']
		 * #swagger.security = [{
		 * 'Authorization':[]
		 * }]
		 */
		await getOne(req, res);
	}
);

router.post('/seed', async (req, res) => {
	/**
     * #swagger.tags = ['Admin']
        #swagger.description = 'this is the seeder file'
    */

	const admin = {
		name: 'Administator',
		email: 'eyoelijah@gmail.com',
		password: 'password123#',
	};

	await register(admin, 'admin', res);
});

module.exports = router;
