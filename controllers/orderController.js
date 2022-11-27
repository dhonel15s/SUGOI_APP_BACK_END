// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");

// FUNCTIONS-----------------------------------------------------------------------

// CREATE ORDER: NON-ADMIN ONLY
module.exports.createOrder = async (customer, requestBody) => {

	if (customer.isAdmin) {
		// IF ADMIN
		let message = Promise.resolve(`Admin cannot create order.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}else{

			// ADD CUSTOMER DETAILS
			let newOrder = new Order({
				userId: customer.userId,
				customerName: customer.fullName,
				itemCount: requestBody.itemCount,
				deliveryAddress: requestBody.deliveryAddress,
				deliveryMode: requestBody.deliveryMode,
				deliveryFee: requestBody.deliveryFee,
				paymentMode: requestBody.paymentMode,
				totalAmount: requestBody.totalAmount
			}); 

			// ADD PRODUCTS TO ORDER
			for(let x = 0; x < requestBody.products.length; x++){
				

				newOrder.products.push({
					// PUSH PRODUCT DETAILS TO ARRAY
					productName: requestBody.products[x].productName,
					productPrice: requestBody.products[x].productPrice,
					quantity: requestBody.products[x].quantity,
					// COMPUTE FOR SUBTOTAL: PER PRODUCT
					subtotal: requestBody.products[x].subtotal
				})		
			};



			// SAVE TO DATABASE
			return newOrder.save()
			.then((newOrder, error) => {
				if(error){
					return {
						status: false,
						message: `Error encountered during checkout.`
					}
				}else{
					return {
						status: true,
						message: `Items successfully checked out.`,
						orderId: newOrder.id
					}
				}
			});
	}

};


/*// ADD TO ORDER: SINGLE PRODUCT
module.exports.addToOrder = async (requestBody) => {
	let order = await Order.find({id : requestBody.orderId})
	.then(order => {
		return order;
	});

	order[0].products.push({
		productName: requestBody.productName,
		productPrice: requestBody.productPrice,
		quantity: requestBody.quantity,
		subtotal: requestBody.subtotal
	})

	return order[0].save()
	.then((updatedOrder, error) => {
		if (error) {
			return {
				status: false,
				message: `Failed to add products to order.`
			}
		}else{
			return {
				status: true,
				message: `Products were successfully added to order.`
			}
		}
	});
}*/


// GET ALL USER'S ORDERS
module.exports.getMyOrders = (customer) => {
	if (customer.isAdmin) {
		let message = Promise.resolve(`Sorry. Admin users must not have order.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}else{
		// IF NOT ADMIN
		return Order.find({ userId : customer.userId })
		.then(result => {
			if (result.length === 0) {
				return {
					status: false,
					message: `No orders found for ${customer.fullName}.` 
				}
			}else{
				return {
					status: true,
					orderCount: result.length,
					details: result
				}
			}
		})
	}
};


// RETRIEVE ALL ORDERS: ADMIN ONLY
module.exports.getAllOrders = (isAdmin) => {
	
	if (isAdmin) {
		return Order.find({})
		.then(orders => {
			return `Total Number of Orders: ${orders.length}\n${orders}`;
		});
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`Sorry. Only admins can retrieve all orders`);

		return message.then((value) => {
			return value;
		});
	}

};
