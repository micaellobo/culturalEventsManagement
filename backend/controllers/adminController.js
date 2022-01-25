const Promoter = require('../models/promoter');
const mongoose = require('mongoose');

const adminController = {};

adminController.getPromoters = async (req, res, next) => {
	try {
		const promoters = await Promoter.find({});

		return res.json(promoters);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error in database' });
	}
};

adminController.updatePromoterStatus = async (req, res, next) => {
	const { id } = req.params;
	const { status } = req.body;

	try {
		const promoter = await Promoter.findById(id).exec();

		if (!promoter) {
			console.log(`Promoter not found`);
			return res.json({ msg: 'Promoter not found' });
		}

		const acceptPromoter = await Promoter.findOneAndUpdate(
			{ _id: id },
			{ $set: { status: status } },
			{ safe: true, new: true, useFindAndModify: false, runValidators: true }
		).exec();

		if (!acceptPromoter) {
			console.log(`Promoter not found`);
			return res.status(404).json({ msg: 'Promoter not found' });
		}

		return res.json(acceptPromoter);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error in database' });
	}
};

adminController.getPromotersByStatus = async (req, res, next) => {
	const { status } = req.params;

	try {
		let promoters = await Promoter.find({ status: status });

		return res.json(promoters);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error in database' });
	}
};

module.exports = adminController;
