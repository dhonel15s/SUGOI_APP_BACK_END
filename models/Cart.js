// DEPENDENCIES
const mongoose = require("mongoose");


// CART SCHEMA
const cartSchema = new mongoose.Schema({
	
	userId: {
		type: String,
		required: [true, "User ID is required."]
	},

	customerName: {
		type: String,
		required: [true, "Customer Name is required."]
	},

	products: [{

		productId: {
			type: String,
			required: [true, "Product ID is required."]
		},

		productName: {
			type: String,
			required: [true, "Product Name is required."]
		},

		productPrice: {
			type: Number,
			required: [true, "Product Price is required."]
		},

		quantity: {
			type: Number,
			default: 1
		},

		addedOn: {
			type: Date,
			default: new Date()
		},

		subtotal: {
			type: Number,
			default: 0
		}

	}],

	totalAmount: {
		type: Number,
		default: 0
	}

});


// EXPORT CART SCHEMA
module.exports = mongoose.model("Cart", cartSchema);