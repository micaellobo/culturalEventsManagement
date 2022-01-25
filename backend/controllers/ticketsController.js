const mongoose = require('mongoose');
const path = require('path');
const Event = require('../models/event');
const Client = require('../models/client');
const EventLocation = require('../models/eventLocation');
const Ticket = require('../models/ticket');
const dateFns = require('date-fns');

const { VALIDATE_OF_COVID_TESTE } = require('../config/businessRules');
const { saveFile } = require('../config/functions');

const {
	queryFindDateTicket,
	queryGetTicketByClient,
	queryGetTickets,
	queryGetTicketsByClient,
	queryGetTicketsByClientAndStatus,
} = require('../config/querys');

const TicketController = {};

TicketController.create = async (req, res, next) => {
	const clientID = req.user._id;

	const { eventID, locationID, date } = req.body;

	try {
		const ticket = new Ticket({ ...req.body, clientID });
		ticket.event = { eventID, locationID, date: new Date(date) };

		const event = await Event.findById(ticket.event.eventID).exec();

		const eventLocationsIds = [];
		event.locations.map((location) => eventLocationsIds.push(location._id));

		//Find the locations associate to the event
		const locationsOfEvent = await EventLocation.find({ _id: { $in: eventLocationsIds } }).exec();

		const { dates } = await event.locations.find((local) => local._id.toString() == ticket.event.locationID.toString());
		const { availableTickets } = await dates.find((date) => new Date(ticket.event.date).getTime() === new Date(date.date).getTime());

		//Nao existe o evento
		if (!event) {
			return res.status(404).json({ msg: 'That event does not exist' });
		}

		//Nao existe evento para este local
		if (locationsOfEvent.length == 0) {
			return res.status(404).json({ msg: 'The event does not exist in that location' });
		}

		//Caso nao esteja definido significa que nao existe o evento para esta data
		if (!availableTickets) {
			return res.status(404).json({ msg: `The event ${event.name} is full` });
		}

		//Nao existem tickets disponiveis
		if (availableTickets == 0) {
			return res.status(404).json({ msg: `The event ${event.name} is full` });
		}

		const file = req.files?.file;
		const dateCovidTest = new Date();
		const nameFile = `${clientID}_${dateCovidTest.getTime()}`;

		//Caso o teste covid seja submetido na compra do ticket
		if (file) {
			await saveFile(file, nameFile, path.join(__dirname, '../covidTests/'));
			await Client.findByIdAndUpdate(clientID, { $push: { covidTestes: dateCovidTest } }, { safe: true, new: true, useFindAndModify: false });
			await TicketController.updateTicketsStatusSubmitCovidTest(clientID, dateCovidTest);

			const isSubmitedNowValideForCurrentTicket = verifyDateCovidTest(ticket.event.date, dateCovidTest);
			if (isSubmitedNowValideForCurrentTicket) {
				console.log('isSubmitedNowValideForCurrentTicket', isSubmitedNowValideForCurrentTicket);
				ticket.status = 'accepted';
			}
		} else {
			const alreadyHaveValideCovidTest = await hasValideCovidTest(clientID, ticket.event.date);
			if (alreadyHaveValideCovidTest) {
				console.log('alreadyHaveValideCovidTest', alreadyHaveValideCovidTest);
				ticket.status = 'accepted';
			}
		}

		ticket.price = event?.price;
		const result = await ticket.save();

		return res.json(result);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

TicketController.cancelTicket = async (req, res, next) => {
	const { id } = req.params;
	const clientID = req.user._id;
	try {
		const ticket = await Ticket.findOne({ _id: id, clientID: clientID }).exec();

		if (!ticket) {
			console.log(`Ticket not found`);
			return res.status(404).json({ msg: 'Ticket not found' });
		}

		const updateTicket = await Ticket.findOneAndUpdate(
			{ _id: id },
			{ $set: { status: 'canceled' } },
			{ safe: true, new: true, useFindAndModify: false, runValidators: true }
		).exec();

		if (!updateTicket) {
			console.log(`Ticket not found`);
			return res.status(404).json({ msg: 'Ticket not found' });
		}

		return res.json(updateTicket);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

TicketController.findOneByClient = async (req, res, next) => {
	const clientID = req.user._id;
	const ticketID = req.params.id;

	try {
		const [ticket] = await Ticket.aggregate(queryGetTicketByClient(clientID, ticketID)).exec();

		if (!ticket) {
			return res.status(404).json({ msg: 'Ticket not found' });
		}
		return res.json(ticket);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

TicketController.find = async (req, res, next) => {
	try {
		const tickets = await Ticket.aggregate(queryGetTickets()).exec();

		return res.json(tickets);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

TicketController.getTicketsByClient = async (req, res, next) => {
	const clientID = req.user._id;

	try {
		let tickets = await Ticket.aggregate(queryGetTicketsByClient(clientID));

		return res.json(tickets);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

TicketController.getTicketsByClientAndStatus = async (req, res, next) => {
	const clientID = req.user._id;
	const { status } = req.params;

	try {
		let tickets = await Ticket.aggregate(queryGetTicketsByClientAndStatus(clientID, status));

		return res.json(tickets);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ msg: 'Ocurred some error database' });
	}
};

TicketController.updateTicketsStatusSubmitCovidTest = async (clientID, dateCovidTest) => {
	const tickets = await Ticket.aggregate(queryGetTicketsByClient(clientID));
	return new Promise((resolve, reject) => {
		tickets.forEach(async (ticket) => {
			if (verifyDateCovidTest(new Date(ticket.date), dateCovidTest)) {
				await Ticket.findByIdAndUpdate(ticket._id, { $set: { status: 'accepted' } }, { safe: true, new: true, useFindAndModify: false });
			}
		});
		resolve();
	});
};

const hasValideCovidTest = async (clientID, ticketDate) => {
	const { covidTestes } = await Client.findById(clientID);
	return covidTestes.some((dateCovidTest) => verifyDateCovidTest(ticketDate, dateCovidTest));
};

const verifyDateCovidTest = (ticketDate, dateCovidTest) => {
	const dateStartMostHaveTest = dateFns.subDays(ticketDate, VALIDATE_OF_COVID_TESTE);
	console.log(
		dateStartMostHaveTest,
		dateCovidTest,
		ticketDate,
		dateCovidTest.getTime() > dateStartMostHaveTest.getTime() && dateCovidTest.getTime() < ticketDate.getTime()
	);
	return dateCovidTest.getTime() > dateStartMostHaveTest.getTime() && dateCovidTest.getTime() < ticketDate.getTime();
};

module.exports = TicketController;
