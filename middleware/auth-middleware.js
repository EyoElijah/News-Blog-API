const passport = require('passport');

const authenticated = passport.authenticate('jwt', {
	session: false,
});

const authorized = (roles) => (req, res, next) => {
	if (roles.includes(req.user.role)) return next();
	res.status(401).json({
		message: 'Unauthourized',
		success: false,
	});
};

module.exports = { authenticated, authorized };
