// DEPENDENCIES
const mongoose = require("mongoose");


// USER SCHEMA
const userSchema = new mongoose.Schema({
	
	email: {
		type: String,
		required: [true, "Email is required."]
	},

	password: {
		type: String,
		required: [true, "Password is required."]
	},

	isAdmin: {
		type: Boolean,
		default: false
	}

});


// EXPORT USER SCHEMA
module.exports = mongoose.model("User", userSchema);