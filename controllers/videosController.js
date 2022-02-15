const Video = require('../models/Video');
const paginate = require('express-paginate');

// add One Category
const addVideo = async (req, res) => {
	try {
		const newRecord = new Video({
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

// delete Video
const removeVideo = async (req, res) => {
	try {
		const deletedVideo = await Video.findByIdAndDelete(req.params.id);
		if (!deletedVideo) {
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

//update Video
const updateVideo = async (req, res) => {
	try {
		await Video.findByIdAndUpdate(req.params.id, req.body);
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
const allVideo = async (req, res) => {
	try {
		const [results, itemCount] = await Promise.all([
			Video.find({})
				.sort({ createdAt: -1 })
				.limit(req.query.limit)
				.skip(req.skip)
				.lean()
				.exec(),
			Video.count({}),
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

// get a single Video
const singleVideo = async (req, res) => {
	try {
		const item = await Video.findByIdAndUpdate(req.params.id, {
			$inc: {
				viewsCount: 1,
			},
		});
		if (item) {
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

const getTopVideos = async (req, res) => {
	try {
		const result = await Video.find({})
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

module.exports = {
	getTopVideos,
	addVideo,
	removeVideo,
	updateVideo,
	singleVideo,
	allVideo,
};
