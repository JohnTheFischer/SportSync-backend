const mongoose = require("mongoose");

const RookieSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		year: {
			type: Number,
			required: true
		},
		gender: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
			// unique: true
		},
		phone: {
			type: String
		},
		dateOfBirth: {
			type: Date
		},
		sport:{
			type:String
		},
		image: {
			type: String
			// required: true
		},
		verified: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Rookie", RookieSchema);
