// DEPENDENCIES
const mongoose = require("mongoose");


// PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
	
	name: {
		type: String,
		required: [true, "Product Name is required."]
	},

	category: {
		type: String,
		required: [true, "Product Category is required."]
	},

	imageLink: {
		type: String,
		required: [true, "Product Image Link is required."]
	},

	description: {
		type: String,
		required: [true, "Product Descripion is required."]
	},

	stocks: {
		type: Number,
		required: [true, "Product stock count is required."]
	},

	price: {
		type: Number,
		required: [true, "Product Price is required."]
	},

	isActive: {
		type: Boolean,
		default: true
	},

	createdOn: {
		type: Date,
		default: new Date()
	}

});


// EXPORT PRODUCT SCHEMA
module.exports = mongoose.model("Product", productSchema);