const Story = require('../models/Story');
const Comment = require('../models/Comment');
const paginate = require('express-paginate');

// add One Category
const addStory = async (req, res) => {
	try {
		const newRecord = new Story({
			...req.body,
			createdBy: req.user._id,
		});
		if (!newRecord.slug) {
			newRecord.slug = generateSlug(newRecord.title);
		}
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

// delete Story
const removeStory = async (req, res) => {
	try {
		const deletedStory = await Story.findByIdAndDelete(req.params.id);
		if (!deletedStory) {
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

//update Story
const updateStory = async (req, res) => {
	try {
		await Story.findByIdAndUpdate(req.params.id, req.body);
		res.status(201).json({
			message: 'succesfully updated',
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

// get all categories
const allStory = async (req, res) => {
	try {
		const [results, itemCount] = await Promise.all([
			Story.find({})
				.populate('category', 'title')
				.sort({ createdAt: -1 })
				.limit(req.query.limit)
				.skip(req.skip)
				.lean()
				.exec(),
			Story.count({}),
		]);
		const pageCount = Math.ceil(itemCount / req.query.limit);
		return res.status(201).json({
			Object: 'list',
			has_more: paginate.hasNextPages(req)(pageCount),
			data: results,
			pageCount,
			itemCount,
			currentPage: req.query.page,
			pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

// get a single Story
const singleStory = async (req, res) => {
	try {
		const item = await Story.findByIdAndUpdate(req.params.id, {
			$inc: {
				viewsCount: 1,
			},
		}).populate('category', 'title');
		if (item) {
			item.comments = await Comment.find({ story: item._id });
			return res.status(200).json({
				success: true,
				itme,
			});
		}
		return res.status(404).json({
			message: 'item not found',
			success: false,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

const getTopStories = async (req, res) => {
	try {
		const result = await Story.find({})
			.populate('category', 'title')
			.sort({ viewsCount: -1 })
			.limit(3)
			.lean()
			.exec();
		return res.status(201).json({
			data: results,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

const singleStoryBySlug = async (req, res) => {
	try {
		const item = await Story.findByIdAndUpdate(req.params.slug, {
			$inc: {
				viewsCount: 1,
			},
		}).populate('category', 'title');
		if (item) {
			item.comments = await Comment.find({ story: item._id });
			return res.status(200).json({
				success: true,
				itme,
			});
		}
		return res.status(404).json({
			message: 'item not found',
			success: false,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

const generateSlug = (title) => {
	const slugText = title
		.toString()
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');

	return slugText;
};

module.exports = {
	getTopStories,
	addStory,
	removeStory,
	updateStory,
	singleStory,
	allStory,
	singleStoryBySlug,
};
