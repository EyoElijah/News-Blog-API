const { check, validationResult } = require('express-validator');

const validationRules = () => {
	return [
		check('oldPassword')
			.trim()
			.isLength({ min: 6, max: 12 })
			.withMessage('Old password must be between 6 and 56 characters'),

		check('newPassword')
			.trim()
			.isLength({ min: 6, max: 12 })
			.withMessage('New password must be between 6 and 56 characters'),
	];
};

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const resultErrors = [];
	errors.array().map((err) => resultErrors.push({ [err.param]: err.mss }));
	resultErrors.push({ message: 'Action unsuccessful' });
	resultErrors.push({ success: false });
	const errorObject = Object.assign({}, ...resultErrors);
	return res.status(422).json(errorObject);
};

module.exports = {
	validationRules,
	validate,
};
