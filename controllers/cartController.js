// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

// FUNCTIONS-----------------------------------------------------------------------

// CREATE CART: NON-ADMIN ONLY
module.exports.addToCart = async (customer, requestBody) => {
	
	if (customer.isAdmin) {
		// IF ADMIN, CANNOT PROCEED TO CREATE CART
		let message = Promise.resolve(`Admin cannot create cart.`);

		return message.then((value) => {
			return value;
		});
	}
	// IF NOT ADMIN, CHECK IF USER HAS EXISTING CART
	else{
		let existingCart = await Cart.find({userId : customer.userId})
		.then(cart => {
			return cart;
		});
		
		// IF NO EXISTING CART, CREATE NEW CART
		if (existingCart.length === 0) {
			let newCart = new Cart({
				userId: customer.userId,
				customerName: customer.fullName
			})

			// ADD PRODUCTS TO CART
			for(let x = 0; x < requestBody.products.length; x++){

				// GET PRODUCT PRICES
				await Product.findById(requestBody.products[x].productId)
				.then(result2 => {

					newCart.products.push({
						// PUSH PRODUCT DETAILS TO ARRAY
						productId: requestBody.products[x].productId,
						productName: result2.name,
						productPrice: result2.price,
						quantity: requestBody.products[x].quantity,
						// COMPUTE FOR SUBTOTAL: PER PRODUCT
						subtotal: result2.price*requestBody.products[x].quantity
					})
					// COMPUTE FOR TOTAL AMOUNT OF ITEMS IN CART
					newCart.totalAmount += result2.price*requestBody.products[x].quantity;
				})
			};

			// SAVE TO DATABASE
			return newCart.save()
			.then((newCart, error) => {
				if(error){
					return `Error in creating cart.`;
				}else{
					return `New cart for (${newCart.customerName}) was successfully created!`;
				}
			});
		}

		// IF THERE IS EXISTING CART, ADD PRODUCTS TO THE EXISTING CART
		else{
			// ADD PRODUCTS TO CART
			for(let x = 0; x < requestBody.products.length; x++){

				// GET PRODUCT PRICES
				await Product.findById(requestBody.products[x].productId)
				.then(result3 => {
					existingCart[0].products.push({
						// PUSH PRODUCT DETAILS TO ARRAY
						productId: requestBody.products[x].productId,
						productName: result3.name,
						productPrice: result3.price,
						quantity: requestBody.products[x].quantity,
						// COMPUTE FOR SUBTOTAL: PER PRODUCT
						subtotal: result3.price*requestBody.products[x].quantity
					})					
					// COMPUTE FOR TOTAL AMOUNT OF ITEMS IN CART
					existingCart[0].totalAmount += result3.price*requestBody.products[x].quantity;
				})
			}

			return existingCart[0].save()
			.then((updatedCart, error) => {
				if (error) {
					return `Failed to add product\\s to (${customer.fullName})\'s cart.`;
				}else{
					return `Product\\s were successfully added to (${customer.fullName})\'s cart.`;
				}
			});
		}
		
	}

};

