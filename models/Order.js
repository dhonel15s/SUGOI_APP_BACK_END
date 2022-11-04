// DEPENDENCIES
const mongoose = require("mongoose");


// ORDER SCHEMA
const orderSchema = new mongoose.Schema({
	
	userId: {
		type: String,
		required: [true, "User ID is required."]
	},

	customerName: {
		type: String
	},

	products: [{

		productId: {
			type: String,
			required: [true, "Product ID is required."]
		},

		quantity: {
			type: Number,
			required: [true, "Product Quantity is required."]
		},

		subtotal: {
			type: Number,
			default: 0
		}

	}],

	totalAmount: {
		type: Number,
		default: 0
	},

	purchasedOn: {
		type: Date,
		default: new Date()
	}
	
});


// EXPORT ORDER SCHEMA
module.exports = mongoose.model("Order", orderSchema);