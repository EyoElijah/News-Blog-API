const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const { welcomeSender, forgotPasswordSender } = require('../mailers/senders');

// validate Email Function,

const validateEmail = async (email) => {
	try {
		const user = await User.findOne({ email });
		if (user) return true;
		else return false;
	} catch (error) {
		console.log(error.message);
	}
};

// register controller
const register = async (data, role, res) => {
	try {
		const emailTaken = await validateEmail(data.email);
		if (emailTaken) {
			return res.status(400).json({
				email: 'Email is already taken',
				message: 'failed to register',
				sucess: false,
			});
		}
		const hashedPassword = await bcrypt.hash(data.password, 16);
		const code = crypto.randomInt(100000, 1000000);
		const newUser = new User({
			...data,
			password: hashedPassword,
			verificationCode: code,
			role,
		});

		await newUser.save();
		welcomeSender(newUser.email, newUser.name, newUser.verificationCode);
		return res.status(201).json({
			message: 'Account successfully created',
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

// login controller

const login = async (data, res) => {
	try {
		const { email, password } = data;
		const user = await User.findOne({ email });
		if (!user)
			return (
				res.status(404),
				json({
					message: 'Failed login attempt',
					email: 'incorrect email',
					success: false,
				})
			);

		const isMatch = await bcrypt.compare(password, user.password);
		if (isMatch) {
			const token = jwt.sign(
				{
					user_id: user._id,
					role: user.role,
					email: user.email,
					name: user.name,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: '60s',
				}
			);
			const profile = {
				email: user.email,
				role: user.role,
				name: user.name,
			};
			const result = {
				user: profile,
				token,
				expiresIn: 60,
			};

			return res.status(200).json({
				...result,
				message: 'login successfully',
				success: true,
			});
		}
		return res.status(403).json({
			message: 'login failed',
			password: 'inocorrect password',
			success: false,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

//Email verification

const verify = async (data, res) => {
	try {
		const { code } = data;
		const user = await User.findOne({ verificationCode: code });
		if (!user) {
			return res.status(404).json({
				message: 'invvalid code',
				success: false,
			});
		}
		if (user.isEmailVerified) {
			return res.status(404).json({
				message: 'Email already verified',
				success: false,
			});
		}
		await user.update({ isEmailVerified: true });
		return res.status(201).json({
			message: 'Email verification success',
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

//forgot password

const forgotPassword = async (data, res) => {
	try {
		const { email } = data;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				message: 'Email not registered',
				success: false,
			});
		}
		const code = crypto.randomInt(100000, 1000000);
		const passwordResetCode = await bcrypt.hash(code.toString(), 16);
		await user.update({ passwordResetCode });
		forgotPasswordSender(user.email, user.name, code);

		return res.status(200).json({
			message: 'Verification code sent to email',
			success: ture,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

//reset password

const resetPassword = async () => {
	try {
		const { email, code, newPassword } = data;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				message: 'Email not Valid',
				success: false,
			});
		}
		const isMatch = await bcrypt.compare(
			code.toString(),
			user.passwordResetCode
		);

		if (isMatch) {
			const hashedPassword = await bcrypt.hash(newPassword, 16);
			await user.update(
				{ password: hashedPassword },
				{ passwordResetCode: '' }
			);
			return res.status(201).json({
				message: 'your password has been reset successfully',
				success: ture,
			});
		}
		return res.status(400).json({
			message: 'code is invalid',
			success: false,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

//change password

const changePassword = async (data, res) => {
	try {
		const { currentPassword, newPassword } = data;
		const user = await User.findById(req.user._id);
		const isMatch = await bcrypt.compare(currentPassword, user.password);

		if (isMatch) {
			const hashedPassword = await bcrypt.hash(newPassword, 16);
			await user.update({ password: hashedPassword });
			return res.status(201).json({
				message: 'your password has been changed',
				success: ture,
			});
		}

		return res.status(400).json({
			message: 'current password is incorrect',
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
	register,
	login,
	validateEmail,
	changePassword,
	resetPassword,
	forgotPassword,
	verify,
	resetPassword,
};
