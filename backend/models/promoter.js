const mongoose = require('mongoose');
const EventLocation = require('./eventLocation');
const Event = require('./event');

const PromoterSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, requred: true },
		events: [{ type: mongoose.Schema.Types.ObjectId, ref: Event }],
		eventLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: EventLocation }],
		status: {
			type: String,
			enum: {
				values: ['active', 'inactive', 'rejected'],
				message: '{VALUE} is not valid status for Promoter account',
			},
			default: 'inactive',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Promoter', PromoterSchema, 'promoters');
