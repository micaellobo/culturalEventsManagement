const mongoose = require('mongoose');

const queryFindDateTicket = (locationID, ticketDate) => [
	{
		$match: {
			'locations._id': mongoose.Types.ObjectId(locationID),
		},
	},
	{
		$unwind: '$locations',
	},
	{
		$unwind: '$locations.dates',
	},
	{
		$group: {
			_id: '$locations.dates.date',
			date: { $first: '$locations.dates.date' },
			availableTickets: { $first: '$locations.dates.availableTickets' },
		},
	},
	{
		$match: {
			date: { $gte: ticketDate, $lte: ticketDate },
		},
	},
	{
		$project: {
			_id: 0,
			date: 1,
			availableTickets: 1,
		},
	},
];

const queryChangNumberAvailableTickets = (eventID, locationID, date, numberTickets) => [
	{ _id: eventID },
	{ $inc: { 'locations.$[local].dates.$[date].availableTickets': numberTickets } },
	{
		arrayFilters: [{ 'local._id': locationID }, { 'date.date': new Date(date) }],
		safe: true,
		new: true,
		useFindAndModify: false,
	},
];

const queryGetEventFullInfo = (id) => [
	{
		$match: {
			_id: mongoose.Types.ObjectId(id),
		},
	},
	{
		$unwind: '$locations',
	},
	{
		$lookup: {
			from: 'eventLocations',
			localField: 'locations._id',
			foreignField: '_id',
			as: 'localInfo',
		},
	},
	{
		$group: {
			_id: '$_id',
			name: { $first: '$name' },
			price: { $first: '$price' },
			description: { $first: '$description' },
			locations: {
				$push: {
					_id: { $first: '$localInfo._id' },
					name: { $first: '$localInfo.name' },
					capacity: { $first: '$localInfo.capacity' },
					capacityLimitation: { $first: '$localInfo.capacityLimitation' },
					address: { $first: '$localInfo.address' },
					createdAt: { $first: '$localInfo.createdAt' },
					updatedAt: { $first: '$localInfo.updatedAt' },
					dates: '$locations.dates',
				},
			},
		},
	},
];

const queryGetTicketByClient = (clientID, id) => [
	{
		$match: {
			_id: mongoose.Types.ObjectId(id),
			clientID: mongoose.Types.ObjectId(clientID),
		},
	},
	{
		$lookup: {
			from: 'eventLocations',
			localField: 'event.locationID',
			foreignField: '_id',
			as: 'localInfo',
		},
	},
	{
		$lookup: {
			from: 'events',
			localField: 'event.eventID',
			foreignField: '_id',
			as: 'eventInfo',
		},
	},
	{
		$group: {
			_id: '$_id',
			code: { $first: '$code' },
			status: { $first: '$status' },
			event: { $first: { $first: '$eventInfo' } },
			location: { $first: { $first: '$localInfo' } },
			date: { $first: '$event.date' },
			createdAt: { $first: '$createdAt' },
			updatedAt: { $first: '$updatedAt' },
		},
	},
	{
		$sort: { date: 1 },
	},
];

const queryGetTickets = () => [
	{
		$lookup: {
			from: 'eventLocations',
			localField: 'event.locationID',
			foreignField: '_id',
			as: 'localInfo',
		},
	},
	{
		$lookup: {
			from: 'events',
			localField: 'event.eventID',
			foreignField: '_id',
			as: 'eventInfo',
		},
	},
	{
		$group: {
			_id: '$_id',
			code: { $first: '$code' },
			status: { $first: '$status' },
			event: { $first: { $first: '$eventInfo' } },
			location: { $first: { $first: '$localInfo' } },
			date: { $first: '$event.date' },
			createdAt: { $first: '$createdAt' },
			updatedAt: { $first: '$updatedAt' },
		},
	},
	{
		$sort: { date: 1 },
	},
];

const queryGetTicketsByClient = (clientID) => [
	{
		$match: {
			clientID: mongoose.Types.ObjectId(clientID),
		},
	},
	{
		$lookup: {
			from: 'eventLocations',
			localField: 'event.locationID',
			foreignField: '_id',
			as: 'localInfo',
		},
	},
	{
		$lookup: {
			from: 'events',
			localField: 'event.eventID',
			foreignField: '_id',
			as: 'eventInfo',
		},
	},
	{
		$group: {
			_id: '$_id',
			code: { $first: '$code' },
			status: { $first: '$status' },
			event: { $first: { $first: '$eventInfo' } },
			location: { $first: { $first: '$localInfo' } },
			date: { $first: '$event.date' },
			createdAt: { $first: '$createdAt' },
			updatedAt: { $first: '$updatedAt' },
		},
	},
	{
		$sort: { date: 1 },
	},
];

const queryGetTicketsByClientAndStatus = (clientID, status) => [
	{
		$match: {
			clientID: mongoose.Types.ObjectId(clientID),
			status: status,
		},
	},
	{
		$lookup: {
			from: 'eventLocations',
			localField: 'event.locationID',
			foreignField: '_id',
			as: 'localInfo',
		},
	},
	{
		$lookup: {
			from: 'events',
			localField: 'event.eventID',
			foreignField: '_id',
			as: 'eventInfo',
		},
	},
	{
		$group: {
			_id: '$_id',
			code: { $first: '$code' },
			status: { $first: '$status' },
			event: { $first: { $first: '$eventInfo' } },
			location: { $first: { $first: '$localInfo' } },
			date: { $first: '$event.date' },
			createdAt: { $first: '$createdAt' },
			updatedAt: { $first: '$updatedAt' },
		},
	},
	{
		$sort: { date: 1 },
	},
];

module.exports = {
	queryChangNumberAvailableTickets,
	queryGetEventFullInfo,
	queryFindDateTicket,
	queryGetTicketByClient,
	queryGetTickets,
	queryGetTicketsByClient,
	queryGetTicketsByClientAndStatus,
};
