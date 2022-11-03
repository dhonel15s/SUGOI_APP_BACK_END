// DEPENDENCIES
const mongoose = require("mongoose");


// ORDER SCHEMA
const orderSchema = new mongoose.Schema({
	
	userId: {
		type: String,
		required: [true, "Order ID is required."]
	},

	products: [{

		productId: {
			type: String,
			required: [true, "Product ID is required."]
		},

		quantity: {
			type: Number,
			required: [true, "Product Quantity is required."]
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