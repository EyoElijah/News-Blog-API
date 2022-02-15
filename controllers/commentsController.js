const Comment = require('../models/Comment');

// add One Comment
const addComment = async (req, res) => {
	try {
		const newRecord = new Comment({
			...req.body,
			createdBy: req.user._id,
		});
		await newRecord.save();
		return res.status(201).json({
			message: 'Item successfully saved',
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

// delete Comment
const removeComment = async (req, res) => {
	try {
		const deletedComment = await Comment.findByIdAndDelete(req.params.id);
		if (!deletedComment) {
			return res.status(400).json({
				message: 'item not found',
				success: false,
			});
		}
		res.status(204).json({
			message: 'item successfully deleted',
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

module.exports = {
	addComment,
	removeComment,
};
