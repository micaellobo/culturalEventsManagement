const mongoose = require('mongoose');

module.exports = mongoose.model('CitiesPT', new mongoose.Schema({}, { strict: false }), 'cidadesPT');
