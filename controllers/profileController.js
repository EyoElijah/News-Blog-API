const User = require('../models/User');

//update user
const updateUser = async (req, res) => {
	try {
		await User.findByIdAndUpdate(req.params.id, req.body);
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

// get a single User
const singleUser = async (req, res) => {
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
	updateUser,
	singleUser,
};
