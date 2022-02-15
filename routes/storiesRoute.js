const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const { authorized, authenticated } = require('../middleware/auth-middleware');
const { validationRules, validate } = require('../validations/story-validator');
const {
	getTopStories,
	addStory,
	removeStory,
	updateStory,
	singleStory,
	allStory,
	singleStoryBySlug,
} = require('../controllers/storiesController');

const PATH = '../public/';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, PATH));
	},
	filename: (req, file, cb) => {
		const fileName = Date.now() + path.extname(file.originalname);
		req.body.imageUrl = fileName;
		cb(null, fileName);
	},
});

const upload = multer({
	storage,
});

router.get('/stories', async (req, res) => {
	// #swagger.tags = ['Posts']
	await allStory(req, res);
});

router.get('/stories/top', async (req, res) => {
	// #swagger.tags = ['Posts']
	await getTopStories(req, res);
});

router.post(
	'/stories',
	authenticated,
	authorized(['admin']),
	upload.any('files')
);
router.post(
	'/stories',
	authenticated,
	authorized(['admin']),
	validationRules(),
	validate,
	async (req, res) => {
		/*  #swagger.tags = ['Posts']
        #swagger.consumes = ['multipart/form-data']
        #swagger.security = [{
        "Authorization": []
        }]
        #swagger.parameters['file'] = {
            in: 'formData',
            required: true,
            type: 'file'
        }
      
    	#swagger.parameters['category'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
      #swagger.parameters['title'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
      #swagger.parameters['body'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
    
    */

		await addStory(req, res);
	}
);

router.put(
	'/stories/:id  ',
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
            schema: { $ref: "#/definitions/StoryModel" }
    } */
		await updateStory(req, res);
	}
);

router.get('/stories/:id  ', async (req, res) => {
	// #swagger.tags = ['Posts']
	await singleStory(req, res);
});

router.get('/stories/slug/:id  ', async (req, res) => {
	// #swagger.tags = ['Posts']
	await singleStoryBySlug(req, res);
});

router.delete(
	'/stories/:id  ',
	authenticated,
	authorized(['admin']),
	async (req, res) => {
		/*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    */
		await removeStory(req, res);
	}
);

module.exports = router;
