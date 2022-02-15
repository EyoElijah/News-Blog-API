const { check, validationResult } = require('express-validator');

const validationRules = () => {
	return [
		check('name')
			.trim()
			.isLength({ min: 3, max: 20 })
			.withMessage('name must be at least 3 character long'),
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
