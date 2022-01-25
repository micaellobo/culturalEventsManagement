const { roles } = require('./authController');
const { secret } = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');
const Promoter = require('../models/promoter');
const Client = require('../models/client');

//Check if is an Promoter
const isPromoter = async (req, res, next) => {
	const tempToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTMwOWIzNTAzNDQ3MzQwODM0Mzc3MCIsInJvbGUiOiJQUk9NT1RFUiIsImlhdCI6MTYyMTYyMjYyMCwiZXhwIjoxNjI0MjE0NjIwfQ.gLI0isL9xB_IDptjGstXQISLRoRhohbPuDg6Gn-vMd8';

	const token = req.cookies['x-access-token'];

	// console.log('\nREQ', req, '\n');
	// console.log('\nreq.headers.cookie', req.headers.cookie, '\n');
	// console.log('\nreq.cookies[x-access-token]', req.cookies['x-access-token'], '\n');
	// console.log('\nreq.cookies', req.cookie, '\n');

	if (!token) {
		console.log('No token provided');
		return res.redirect('/login');
	}

	jwt.verify(token, secret, { complete: true }, async (err, decoded) => {
		if (!decoded) {
			console.log('Expired Session');
			return res.redirect('/login');
		} else {
			const promoter = await Promoter.findById(decoded.payload.id).exec();

			if (!promoter) {
				console.log('Promoter not found');
				return res.redirect('/login');
			} else if (promoter.status === 'inactive') {
				console.log('Your accout is inactive, an Admin most active it');
				return res.json({ errors: [{ msg: 'Your accout is inactive, an Admin most active it' }] });
				// return res.redirect('/login');
			} else {
				req.user = promoter;
				return next();
			}
		}
	});
};

//Check if is an Client
const isClient = (req, res, next) => {
	const token = req.headers['x-access-token'];

	if (!token) {
		console.log('Client No token provided');
		return res.status(401).json({ errors: [{ msg: 'No token provided' }] });
	}

	jwt.verify(token, secret, { complete: true }, async (err, decoded) => {
		if (!decoded) {
			console.log('Expired Session');
			return res.json({ errors: [{ msg: 'Expired Session' }] });
		} else {
			const client = await Client.findById(decoded.payload.id).exec();

			if (!client) {
				console.log('Client not found');
				return res.redirect('/login');
			} else {
				req.user = client;
				return next();
			}
		}
	});
};

const isClientBanned = (req, res, next) => {
	const client = req.user;
	console.log('Verify banned', client.name);
	if (client.status === 'banned') {
		console.log('Your accout is banned');
		return res.json({ errors: [{ msg: 'Your accout is banned' }] });
	}
	return next();
};

const getClientInfo = async (req, res, next) => {
	const token = req.cookies['x-access-token'];

	jwt.verify(token, secret, { complete: true }, async (err, decoded) => {
		const client = await Client.findById(decoded.payload.id).exec();
		console.log('client', client);
		res.user = client;
	});
};

module.exports = { isPromoter, isClient, getClientInfo, isClientBanned };
