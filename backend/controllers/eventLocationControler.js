const mongoose = require('mongoose');
const EventLocation = require('../models/eventLocation');
const Event = require('../models/event');
const Promoter = require('../models/promoter');
const Cities = require('../models/cities');

const eventLocationControler = {};

eventLocationControler.formCreate = async (req, res) => {
	// const cities = await getCities();

	let cities = await Cities.aggregate([{ $sort: { name: -1 } }]);

	res.render('eventLocation/createEventLocation', { cities });
};

eventLocationControler.save = async (req, res) => {
	let cityInfo = {};
	const { street, number, city } = req.body;

	try {
		cityInfo = await Cities.findOne({ name: city });

		if (!cityInfo) {
			console.log(`City ${city} dont exist`);
			return res.redirect('/eventLocation/create');
		}
		cityInfo = cityInfo.toObject();
	} catch (error) {
		console.log(error);
		return res.redirect('/eventLocation/create');
	}

	const eventLocation = new EventLocation(req.body);
	eventLocation.address = address = { city: cityInfo, street, number };

	//Save the eventLocation in the database
	eventLocation.save((err, dbEventLocation) => {
		if (err) {
			console.log(err);
			return res.render('eventLocation/editEventLocation', { eventLocation, cities });
		} else {
			Promoter.findByIdAndUpdate(
				req.user._id,
				{ $push: { eventLocations: eventLocation._id } },
				{ safe: true, new: true, useFindAndModify: false },
				(err, updatedPromoter) => {
					if (err) {
						console.log(err);
					} else {
						console.log(`\nLocal ${req.body.name} adicionado com sucesso\n`);
						return res.redirect('/eventLocation/view/' + dbEventLocation._id);
					}
				}
			);
		}
	});
};

eventLocationControler.formEdit = async (req, res) => {
	try {
		const cities = await Cities.find({});

		const eventLocation = await EventLocation.findById(req.params.id);

		if (!eventLocation) {
			console.log(`Ocorreu um erro na procura!`);
			returnres.redirect(`/error`);
		}
		return res.render('eventLocation/editEventLocation', { eventLocation, cities });
	} catch (error) {
		console.log(error);
		return res.redirect(`/error`);
	}
};

eventLocationControler.edit = async (req, res) => {
	let cityInfo = {};
	const { street, number, city } = req.body;

	try {
		cityInfo = await Cities.findOne({ name: city });
		cityInfo = cityInfo.toObject();

		if (!cityInfo) {
			console.log(`City ${city} dont exist`);
			return res.redirect('/eventLocation/create');
		}
		// delete cityInfo._id;
	} catch (error) {
		console.log(error);
		return res.redirect('/eventLocation/create');
	}
	const eventLocation = new EventLocation(req.body);
	eventLocation.address = address = { city: cityInfo, street, number };

	const newEventLocation = eventLocation.toObject();
	delete newEventLocation._id;

	EventLocation.findByIdAndUpdate(req.params.id, newEventLocation, { safe: true, new: true, useFindAndModify: false }, (err, updateEventLocation) => {
		if (!updateEventLocation) {
			console.log(`\nThat Event Location dont exists\n`);
			return res.redirect(`/eventLocation/view/${req.params.id}`);
		} else {
			console.log(`\n${updateEventLocation.name} editado com sucesso!!\n`);
			return res.redirect(`/eventLocation/view/${updateEventLocation._id}`);
		}
	});
};

eventLocationControler.viewDetails = (req, res) => {
	EventLocation.findById(req.params.id).exec((err, dbEventLocation) => {
		if (!dbEventLocation) {
			console.log(`\nThat Event Location dont exists\n`);
			return res.redirect('/error');
		} else {
			res.render('eventLocation/viewEventLocation', { eventLocation: dbEventLocation });
		}
	});
};

eventLocationControler.delete = async (req, res) => {
	const { id: eventLocationID } = req.params;
	try {
		const promoter = await Promoter.findOneAndUpdate(
			{ eventLocations: { $in: [new mongoose.Types.ObjectId(eventLocationID)] } },
			{ $pull: { eventLocations: new mongoose.Types.ObjectId(eventLocationID) } },
			{ safe: true, new: true, useFindAndModify: false }
		);

		if (!promoter) console.log(`\nThat Event Location dont exists\n`);
		else console.log(`Removido com Sucesso`);
	} catch (error) {
		console.log(error);
	}
	return res.redirect('/eventLocation/list');
};

eventLocationControler.list = (req, res) => {
	//Find eventLocations that exists in the current Promoter
	EventLocation.find({ _id: { $in: req.user.eventLocations } }).exec((err, dbEventLocations) => {
		if (err) res.redirect('/index');
		else res.render('eventLocation/listEventLocations', { eventLocations: dbEventLocations });
	});
};

eventLocationControler.info = async (req, res) => {
	const locations = await EventLocation.find({ _id: { $in: req.user.eventLocations } });
	const result = [];
	await countEvents(locations, result);
	return res.render('eventLocation/infoLocations', { locations: result });
};

const countEvents = (locations, result) => {
	return new Promise((resolve, reject) => {
		locations.forEach(async (local) => {
			const events = await Event.find({ 'locations._id': new mongoose.Types.ObjectId(local._id) });
			let loc = local.toObject();
			loc.numberEvents = events.length;
			result.push(loc);
			resolve();
		});
	});
};

module.exports = eventLocationControler;
