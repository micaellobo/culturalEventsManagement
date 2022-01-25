const Client = require('../models/client');
const Tickets = require('../models/ticket');

const bcrypt = require('bcryptjs');
const dateFns = require('date-fns');
const path = require('path');
const { updateTicketsStatusSubmitCovidTest } = require('../controllers/ticketsController');
const { saveFile } = require('../config/functions');

const {} = require('../config/querys');

const clientController = {};

clientController.findOne = async (req, res, next) => {
	const id = req.user._id;
	try {
		let client = await Client.findById(id);
		client = client.toObject();

		if (!client) {
			console.log(`That Client does not exist`);
			return res.status(404).json({ msg: `That Client does not exist` });
		}
		const dateNow = new Date();
		const { length: numberCanceledTickets } = await Tickets.find({
			clientID: id,
			status: 'canceled',
			updatedAt: { $gte: new Date(dateFns.subDays(dateNow, 30)), $lt: dateNow },
		});
		console.log('numberCanceledTickets', numberCanceledTickets);

		client.numberCanceledTickets = numberCanceledTickets;
		return res.json(client);
	} catch (error) {
		console.log(error);

		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

clientController.update = async (req, res, next) => {
	let errors = [];
	const id = req.user._id;

	const { name, email } = req.body;

	if (!name || !email) errors.push({ msg: 'Please enter all fields' });

	if (errors.length > 0) {
		return res.status(400).json(errors);
	}
	try {
		const client = await Client.findOneAndUpdate(
			{ _id: id },
			{ $set: { name: name, email: email } },
			{ safe: true, new: true, useFindAndModify: false }
		);
		if (!client) {
			console.log(`That Client does not exist`);
			return res.status(404).json({ msg: `That Client does not exist` });
		}
		return res.json(client);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

clientController.updatePassword = async (req, res, next) => {
	let errors = [];

	const id = req.user._id;

	const { password } = req.body;

	if (password.length < 8) {
		errors.push({ msg: 'Password must be at least 8 characters' });
		return res.status(400).json(errors);
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 12);

		const client = await Client.findOneAndUpdate(
			{ _id: id },
			{ $set: { password: hashedPassword } },
			{ safe: true, new: true, useFindAndModify: false }
		);
		if (!client) {
			console.log(`That Client does not exist`);
			return res.status(404).json({ msg: `That Client does not exist` });
		}
		return res.json(client);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

clientController.addCovidTeste = async (req, res, next) => {
	const clientID = req.user._id;

	const file = req.files?.file;
	const diretory = path.join(__dirname, '../covidTests/');
	const dateCovidTest = new Date();
	const nameFile = `${clientID}_${dateCovidTest.getTime()}`;

	if (!file) {
		console.log(`No file sended`);
		return res.status(404).json({ msg: `No file sended` });
	}

	try {
		const client = await Client.findOneAndUpdate(
			{ _id: clientID },
			{ $push: { covidTestes: dateCovidTest } },
			{ safe: true, new: true, useFindAndModify: false }
		);
		if (!client) {
			console.log(`That Client does not exist`);
			return res.status(404).json({ msg: `That Client does not exist` });
		}

		await saveFile(file, nameFile, diretory);

		await updateTicketsStatusSubmitCovidTest(client._id, dateCovidTest);

		return res.json(client);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

module.exports = clientController;
