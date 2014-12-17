var mongoose = require('mongoose');

module.exports = mongoose.model('Message', {
	author : String,
	text : String,
	time : String,
	url : String
});