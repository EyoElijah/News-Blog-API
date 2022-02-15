const router = require('express').Router();

const { authenticated } = require('../middleware/auth-middleware');
const {
	validationRules,
	validate,
} = require('../validations/comment-validator');
const {
	addComment,
	removeComment,
} = require('../controllers/commentsController');

router.post(
	'/comments',
	authenticated,
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
            schema: { $ref: "#/definitions/CommentModel" }
    } */
		await addComment(req, res);
	}
);

router.delete('/comments/:id  ', authenticated, async (req, res) => {
	/*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    */
	await removeComment(req, res);
});

module.exports = router;
