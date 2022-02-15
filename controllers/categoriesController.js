const Category = require('../models/Category');
const paginate = require('express-paginate');

// add One Category
const addCategory = async (req, res) => {
	try {
		const newRecord = new Category({
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

// delete category
const removeCategory = async (req, res) => {
	try {
		const deletedCategory = await Category.findByIdAndDelete(req.params.id);
		if (!deletedCategory) {
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

//update category
const updateCategory = async (req, res) => {
	try {
		await Category.findByIdAndUpdate(req.params.id, req.body);
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
const allCategory = async (req, res) => {
	try {
		const [results, itemCount] = await Promise.all([
			Category.find({})
				.sort({ createdAt: -1 })
				.limit(req.query.limit)
				.skip(req.skip)
				.lean()
				.exec(),
			Category.count({}),
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

// get a single category
const singleCategory = async (req, res) => {
	try {
		const item = await Category.findById(req.params.id);
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
	addCategory,
	removeCategory,
	updateCategory,
	singleCategory,
	allCategory,
};
