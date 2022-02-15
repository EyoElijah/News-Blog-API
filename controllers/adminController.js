const User = require('../models/User');
const paginate = require('express-paginate');

// get all User
const getAll = async (req, res) => {
	try {
		const [results, itemCount] = await Promise.all([
			User.find({})
				.sort({ createdAt: -1 })
				.limit(req.query.limit)
				.skip(req.skip)
				.lean()
				.exec(),
			User.count({}),
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

// get a single User
const getOne = async (req, res) => {
	try {
		const item = await User.findById(req.params.id);
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

module.exports = {
	getAll,
	getOne,
};
