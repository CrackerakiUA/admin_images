var mongoose = require('mongoose');
var Schema = mongoose.Schema({
	points: Number,
	status: {type: String, enum: ['Archived']},
	loc: String
});
module.exports = mongoose.model('Picture', Schema);