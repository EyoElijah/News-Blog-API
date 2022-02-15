const router = require('express').Router();

const { authorized, authenticated } = require('../middleware/auth-middleware');
const { validationRules, validate } = require('../validations/video-validator');
const {
	getTopVideos,
	addVideo,
	removeVideo,
	updateVideo,
	singleVideo,
	allVideo,
} = require('../controllers/videosController');

router.get('/videos', async (req, res) => {
	// #swagger.tags = ['Posts']
	await allVideo(req, res);
});

router.post(
	'/videos',
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
            schema: { $ref: "#/definitions/VideoModel" }
    } */
		await addVideo(req, res);
	}
);

router.put(
	'/videos/:id  ',
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
            schema: { $ref: "#/definitions/VideoModel" }
    } */
		await updateVideo(req, res);
	}
);

router.get('/videos/:id  ', async (req, res) => {
	// #swagger.tags = ['Posts']
	await singleVideo(req, res);
});

router.delete(
	'/vidoes/:id  ',
	authenticated,
	authorized(['admin']),
	async (req, res) => {
		/*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    */
		await removeVideo(req, res);
	}
);

router.get('/videos/top', async (req, res) => {
	// #swagger.tags = ['Posts']
	await getTopVideos(req, res);
});

module.exports = router;
