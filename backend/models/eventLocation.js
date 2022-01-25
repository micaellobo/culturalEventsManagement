var mongoose = require('mongoose');

var eventLocationSchema = new mongoose.Schema(
	{
		name: String,
		capacity: Number,
		address: {
			number: Number,
			street: String,
			city: {
				name: String,
				lat: String,
				lng: String,
			},
		},
		capacityLimitation: { type: Number, min: 0, max: 100 },
	},
	{ timestamps: true }
);

eventLocationSchema.virtual('availableCapacity').get(function () {
	return this.capacity * (this.capacityLimitation / 100);
});

module.exports = mongoose.model('EventLocation', eventLocationSchema, 'eventLocations');
