const mongoose = require('mongoose');
const dateFns = require('date-fns');
const { MAX_CANCELED_TICKETS_CLIENT } = require('../config/businessRules');

// ,autoIncrement = require('mongoose-auto-increment');

const TicketSchema = new mongoose.Schema(
	{
		code: { type: Number, default: 0 },
		clientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
		event: {
			eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
			locationID: { type: mongoose.Schema.Types.ObjectId, ref: 'EventLocation', required: true },
			date: { type: Date, required: true },
		},
		price: { type: Number, min: 0, default: 0 },
		status: {
			type: String,
			enum: {
				values: ['canceled', 'pending', 'accepted', 'rejected'],
				message: '{VALUE} is not valid status for the ticket',
			},
			default: 'pending',
		},
	},
	{ timestamps: true }
);

//Trigger to generate the code for the ticket
TicketSchema.pre('save', function (next) {
	const docs = this;
	mongoose.model('Ticket', TicketSchema).countDocuments(function (error, counter) {
		if (error) {
			console.log(error);
			return next(error);
		}
		docs.code = counter + 1;
		next();
	});
});

//Trigger to decrement the available tickets
TicketSchema.post('save', async function (doc, next) {
	try {
		const event = await mongoose.model('Event').findOneAndUpdate(
			{ _id: doc.event.eventID },
			{ $inc: { 'locations.$[local].dates.$[date].availableTickets': -1 } },
			{
				arrayFilters: [{ 'local._id': doc.event.locationID }, { 'date.date': new Date(doc.event.date) }],
				safe: true,
				new: true,
				useFindAndModify: false,
			}
		);
		// console.log('event', JSON.stringify(event, null, '\t'));
		next();
	} catch (error) {
		console.log(error);
		return next(error);
	}
});

//Trigger to control de canceled tickets by the Client
TicketSchema.post('findOneAndUpdate', async function (doc, next) {
	const dateNow = new Date();
	try {
		const { length: numberCanceledTickets } = await this.model.find({
			clientID: doc.clientID,
			status: 'canceled',
			updatedAt: { $gte: new Date(dateFns.subDays(dateNow, 30)), $lt: dateNow },
		});

		console.log(`Number Canceled Tickets ${numberCanceledTickets}`);

		if (numberCanceledTickets >= MAX_CANCELED_TICKETS_CLIENT) {
			const client = await mongoose.model('Client').findByIdAndUpdate(doc.clientID, { status: 'banned' });
			console.log(`Account of client ${client.name} was been banned`);
		}

		next();
	} catch (error) {
		console.log(error);
		return next(error);
	}
});

module.exports = mongoose.model('Ticket', TicketSchema, 'tickets');

// TicketSchema.pre('findOneAndUpdate', async function () {
// 	const docToUpdate = await this.model.findOne(this.getQuery());
// 	console.log('PRE', JSON.stringify(result, null, '\t'));
// });
