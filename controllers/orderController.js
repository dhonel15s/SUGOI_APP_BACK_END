// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const Order = require("../models/Order.js");
const User = require("../models/User.js");

// FUNCTIONS-----------------------------------------------------------------------

// CREATE ORDER: NON-ADMIN ONLY
module.exports.createOrder = (userId, isAdmin, requestBody) => {

	// FIND CUSTOMER DETAILS
	let customer = User.findById(userId);


	if (isAdmin) {
		// IF ADMIN
		let message = Promise.resolve(`Admin cannot create order.`);

		return message.then((value) => {
			return value;
		});
	}else{
		let newOrder = new Order({
			userId: userId,
			customerName: customer.
			products: [
				productId: requestBody.productId,
				quantity: requestBody.quantity,
				subtotal: 
			],
			totalAmount:
		})

		return newOrder.save()
		.then((newOrder, error) => {
			if (error) {
				return `Failed to create new order.`;
			}else{
				return `Order successfully created.`;
			}
		});
	}

};