const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, SESSION_EXPIRATION } = require('../config/jwtConfig');
const { roles } = require('../config/businessRules');

const Promoter = require('../models/promoter');
const Client = require('../models/client');

//Sign-in Handler
const registerHandler = async (req, res) => {
	const errors = [];
	let User = {};

	const { name, email, password, password2, role } = req.body;

	//Verify required imputs
	if (!name || !email || !password || !password2) errors.push({ msg: 'Please enter all fields' });

	//Verify confimation password
	if (password != password2) errors.push({ msg: 'Passwords do not match' });

	//Verify passwor
	if (password.length < 8) errors.push({ msg: 'Password must be at least 8 characters' });

	if (errors.length > 0) return res.status(404).json({ errors, name, email, password, password2 });

	if (role === roles.PROMOTER) User = Promoter;
	else if (role === roles.CLIENT) User = Client;
	else if (role === roles.ADMIN) {
	}
	const userExists = await User.findOne({ email: email }).exec();
	const hashedPassword = await bcrypt.hash(password, 12);

	if (userExists) {
		errors.push({ msg: 'That email already exists' });
		return res.status(401).json({ errors, name, email, password, password2 });
	} else {
		const user = new User(req.body);

		user.password = hashedPassword;

		await user.save();

		return res.json({ success: true });
	}
};

//Login Handler
const loginHandler = async (req, res, next) => {
	let User = {};
	const errors = [];

	console.log('BODY', req.body);

	const { email, password, role } = req.body;

	if (role === roles.PROMOTER) {
		User = Promoter;
	} else if (role === roles.CLIENT) {
		User = Client;
	} else if (role === roles.ADMIN) {
		//FALTA PARA ADMIN
	} else {
		errors.push({ msg: 'User not found' });
		return res.json({ errors, email, password, role });
	}

	const user = await User.findOne({ email: email }).exec();

	if (!user) {
		errors.push({ msg: 'User not found' });
		return res.json({ errors, email, password, role });
	} else {
		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			errors.push({ msg: 'Password does not match' });
			return res.json({ errors, email, password, role });
		} else {
			if (role === roles.PROMOTER) {
				if (user.status === 'inactive') {
					errors.push({ msg: 'Your accout is inactive, an Admin most active it' });
					return res.json({ errors, email, password, role });
				} else if (user.status === 'rejected') {
					errors.push({ msg: 'Your accout was rejected by an Admin' });
					return res.json({ errors, email, password, role });
				}
			} else if (role === roles.CLIENT && user.status === 'banned') {
				errors.push({ msg: 'Your accout is is banned' });
				return res.json({ errors, email, password, role });
			}

			const token = jwt.sign({ id: user._id, role }, secret, { expiresIn: SESSION_EXPIRATION });

			const expiresAt = new Date(Date.now() + SESSION_EXPIRATION * 1000);

			res.header('x-access-token', token);

			res.clearCookie('x-access-token');
			res.cookie('x-access-token', token, { expires: expiresAt, secure: false, httpOnly: false });

			return res.json({ success: true, name: user.name, id: user._id, role: user.role, expiresAt });
		}
	}
};

const logoutHandler = (req, res) => {
	var referer = new URL(req.headers.referer);
	console.log(referer.host);
	res.clearCookie('x-access-token');
	return res.redirect('/login');
};

module.exports = { registerHandler, loginHandler, logoutHandler, roles };
