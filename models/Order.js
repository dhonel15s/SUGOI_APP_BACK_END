// DEPENDENCIES
const mongoose = require("mongoose");


// ORDER SCHEMA
const orderSchema = new mongoose.Schema({
	
	userId: {
		type: String,
		required: [true, "User ID is required."]
	},

	customerName: {
		type: String,
		required: [true, "Customer Name is required."]
	},

	itemCount: {
		type: Number,
		default: 0
	},

	products: [{


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

		subtotal: {
			type: Number,
			default: 0
		}

	}],

	deliveryAddress: {
		type: String,
		required: [true, "Delivery Address is required."]
	},

	deliveryMode: {
		type: String,
		required: [true, "Delivery Mode is required."]
	},

	deliveryFee: {
		type: Number,
		required: [true, "Delivery Fee is required."]
	},

	paymentMode: {
		type: String,
		required: [true, "Payment Mode is required."]
	},

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