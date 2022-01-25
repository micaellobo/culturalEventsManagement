const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwtConfig');

const Event = require('../models/event');
const EventLocation = require('../models/eventLocation');
const Promoter = require('../models/promoter');
const Client = require('../models/client');

const { queryGetEventFullInfo } = require('../config/querys');
const { saveFile, deleteFile } = require('../config/functions');

const eventControler = {};

eventControler.formCreate = async (req, res) => {
	try {
		const locations = await EventLocation.find({ _id: { $in: req.user.eventLocations } });

		return res.render('event/createEvent', { locations });
	} catch (error) {
		console.log(error);
		return res.redirect('/');
	}
};

eventControler.save = async (req, res) => {
	let event = new Event(req.body);

	const errors = checkData(req);
	if (errors?.length > 0) {
		const locations = await EventLocation.find({ _id: { $in: req.user.eventLocations } });
		return res.render('event/createEvent', { locations, errors });
	}

	const file = req?.files?.image;
	const diretory = path.join(__dirname, '../public/images/events/');
	await saveFile(file, event._id, diretory);

	await associateLocations(req, res, event);

	const eventDB = await event.save();
	//Associate this event to the current logged Promoter
	Promoter.findByIdAndUpdate(req.user._id, { $push: { events: event._id } }, { safe: true, new: true, useFindAndModify: false }, (err) => {
		if (err) console.log(err);
		else {
			console.log(`Evento ${req.body.name} adicionado com sucesso`);
			return res.redirect(`/event/view/${eventDB._id}`);
		}
	});
};

eventControler.edit = async (req, res) => {
	const file = req?.files?.image;
	const diretory = path.join(__dirname, '../public/images/events/');

	const eventModel = new Event(req.body);
	let updateData = eventModel.toObject();

	const errors = checkData(req);

	if (errors?.length > 0) {
		const locations = await EventLocation.find({ _id: { $in: req.user.eventLocations } });
		updateData.locations = locations;
		return res.render('event/editEvent', { event: updateData, errors });
	}

	delete updateData._id;
	delete updateData.createdAt;
	delete updateData.updatedAt;

	await associateLocations(req, res, updateData);
	console.log(updateData);
	try {
		const event = await Event.findByIdAndUpdate(req.params.id, updateData, { safe: true, new: true, useFindAndModify: false });

		if (!event) {
			//Caso entre significa que nao existe o que tentou editar e assim vai criar um novo
			//Isto pode acontecer quando ao criar um event tem erros de imput, e redirecionado para o editar, mas como ainda nao foi criado da erro no find
			eventModel.locations = updateData.locations;
			await deleteFile(`${req.params.id}.png`, diretory);
			await saveFile(file, eventModel._id, diretory);
			await eventModel.save();
			await Promoter.findByIdAndUpdate(req.user._id, { $push: { events: eventModel._id } }, { safe: true, new: true, useFindAndModify: false });
			return res.redirect(`/event/view/${eventModel._id}`);
		}

		await deleteFile(`${req.params.id}.png`, diretory);
		await saveFile(file, event._id, diretory);
		return res.redirect(`/event/view/${event._id}`);
	} catch (error) {
		console.log(error);
		return res.redirect(`/event/list/`);
	}
};

eventControler.viewDetails = async (req, res) => {
	try {
		const [event] = await Event.aggregate(queryGetEventFullInfo(req.params.id));

		if (!event) {
			console.log(`That Event dont exists`);
			return res.redirect('/event/list');
		}
		return res.render(`event/viewEvent`, { event });
	} catch (error) {
		console.log(`Erro base dados`);
	}
};

eventControler.formEdit = async (req, res) => {
	console.log('REQ', req.params.id);
	let [event] = await Event.aggregate(queryGetEventFullInfo(req.params.id));

	if (!event) {
		console.log(`\nThat Event dont exists1\n`);
		return res.redirect('/event/list');
	} else {
		return res.render(`event/editEvent`, { event });
	}
};

eventControler.delete = async (req, res) => {
	const { id: eventID } = req.params;
	try {
		const promoter = await Promoter.findOneAndUpdate(
			{ events: { $in: [new mongoose.Types.ObjectId(eventID)] } },
			{ $pull: { events: new mongoose.Types.ObjectId(eventID) } },
			{ safe: true, new: true, useFindAndModify: false }
		);

		if (!promoter) console.log(`\nThat Event dont exists2\n`);
		else console.log(`Removido com Sucesso`);
	} catch (error) {
		console.log(error);
	}
	return res.redirect('/event/list');
};

eventControler.list = (req, res) => {
	//Find events that exists in the current Promoter
	Event.find({ _id: { $in: req.user.events } }).exec((err, dbEvents) => {
		if (!dbEvents) {
			console.log('ERRO-LIST');
			return res.status(400).end();
		} else {
			return res.render('event/listEvents', { events: dbEvents });
		}
	});
};

//List all events available
eventControler.listHomePage = async (req, res, next) => {
	const token = req.cookies['x-access-token'] || req.headers['x-access-token'];
	console.log(req.cookies['x-access-token'], req.headers['x-access-token']);
	jwt.verify(token, secret, async (err, decoded) => {
		const events = await Event.find({}).exec();
		const client = await Client.findById(decoded?.id).exec();
		console.log(client?.name);
		return res.render('index', { events, user: client });
	});
};

eventControler.getEvent = async (req, res, next) => {
	try {
		let [event] = await Event.aggregate(queryGetEventFullInfo(req.params.id));

		if (!event) {
			console.log(`\nThat Event dont exists3\n`);
			return res.json({ msg: 'That event does not exist' });
		}

		await getWeather(event);

		return res.json(event);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

const checkData = (req) => {
	const errors = [];

	let { locationsChecked } = req.body;

	if (!locationsChecked) {
		//Caso nao tenha selecionado nenhum local para o evento
		console.log('No selected locations');
		errors.push({ msg: 'Please you need select location to the event' });
		return errors;
	}

	//Caso nao seja array colocar como array para nao haver casos especificos
	if (!(locationsChecked instanceof Array)) {
		locationsChecked = [`${locationsChecked}`];
	}

	//Verify if an image was send
	if (!req.files || Object.keys(req.files).length === 0) {
		console.log(req.files);
		console.log('NO FILES');
		errors.push({ msg: 'Please you need upload a image' });
	}

	//Verify if the selected  locations have dates associated
	for (let i = 0; i < locationsChecked.length; i++) {
		const element = locationsChecked[i];
		const datesArray = JSON.parse(JSON.stringify(req.body[element])).split(',');

		if (datesArray.includes('')) {
			console.log('NO dates Selected');
			errors.push({ msg: 'You must select dates for all selected locations' });
			break;
		}
	}
	return errors;
};

const associateLocations = async (req, res, event) => {
	console.log(req.body);

	let { locationsChecked } = req.body;

	if (!(locationsChecked instanceof Array)) {
		locationsChecked = [`${locationsChecked}`];
	}

	for (const locationID of locationsChecked) {
		const { availableCapacity: availableTickets } = await EventLocation.findById(locationID);

		const location = { _id: new mongoose.Types.ObjectId(locationID), dates: [] };

		const datesArray = JSON.parse(JSON.stringify(req.body[locationID])).split(',');

		datesArray.map((date) => location.dates.push({ date, availableTickets }));
		event.locations.push(location);
	}
};

const requestWeather = async (lat, lng) => {
	const openweathermaps_key = '4da547664e101a9f53da4773ab8c3988';
	const exclude = `current,minutely,hourly,alerts`;
	const units = `metric`; //to get in Celsius;
	try {
		const response = await axios.get(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=${exclude}&units=${units}&appid=${openweathermaps_key}`
		);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

const getWeather = async (event) => {
	for (let local of event.locations) {
		const { lat, lng } = local.address.city;
		const weather7DaysLocal = await requestWeather(lat, lng);
		for (let date of local.dates) {
			const weatherDay = weather7DaysLocal?.daily.find((day) => {
				const dateDayWeather = new Date(day.dt * 1000);
				const dateEvent = new Date(date.date.getTime());

				// console.log('dateDayWeather', dateDayWeather);
				// console.log('dateEvent', dateEvent);
				// console.log(dateDayWeather.getDate(), dateEvent.getDate());
				// console.log(dateDayWeather.getMonth(), dateEvent.getMonth());
				// console.log(dateDayWeather.getFullYear(), dateEvent.getFullYear());
				// console.log(
				// 	dateDayWeather.getDate() === dateEvent.getDate() &&
				// 	dateDayWeather.getMonth() === dateEvent.getMonth() &&
				// 		dateDayWeather.getFullYear() === dateEvent.getFullYear()
				// 		);
				// 		console.log();

				// Necessario comparar assim porque o API retorna date com horas
				return (
					dateDayWeather.getDate() === dateEvent.getDate() &&
					dateDayWeather.getMonth() === dateEvent.getMonth() &&
					dateDayWeather.getFullYear() === dateEvent.getFullYear()
				);
			});
			// console.log('weatherDay', weatherDay);
			if (weatherDay) {
				date.weather = { ...weatherDay.weather[0], temp: weatherDay.temp };
			} else {
				date.weather = 'No weather available';
			}
		}
	}
};

module.exports = eventControler;
