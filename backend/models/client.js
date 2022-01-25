const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, requred: true },
		status: {
			type: String,
			enum: {
				values: ['active', 'banned'],
				message: '{VALUE} is not valid status for Client account',
			},
			default: 'active',
		},
		covidTestes: [Date],
	},
	{ timestamps: true }
);

// ClientSchema.post('findOneAndUpdate', async function (doc, next) {});

module.exports = mongoose.model('Client', ClientSchema, 'clients');
