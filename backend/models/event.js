var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		date: Date,
		locations: [
			{
				_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EventLocation' },
				dates: [{ _id: false, date: Date, availableTickets: { type: Number, min: 0, default: 0 } }],
			},
		],
		price: { type: Number, min: 0, default: 0 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema, 'events');
