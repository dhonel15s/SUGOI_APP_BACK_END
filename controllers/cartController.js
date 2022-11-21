// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

// FUNCTIONS-----------------------------------------------------------------------

// CREATE CART: NON-ADMIN ONLY
module.exports.addToCartMany = async (customer, requestBody) => {
	
	if (customer.isAdmin) {
		// IF ADMIN, CANNOT PROCEED TO CREATE CART
		let message = Promise.resolve(`Admin cannot create cart.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}
	// IF NOT ADMIN, CHECK IF USER HAS EXISTING CART
	else{
		let existingCart = await Cart.find({userId : customer.userId})
		.then(cart => {
			return cart;
		});
		
		// IF NO EXISTING CART, CREATE NEW CART-------------------------------------------------------
		if (existingCart.length === 0) {
			let newCart = new Cart({
				userId: customer.userId,
				customerName: customer.fullName
			})

			// ADD PRODUCTS TO CART
			for(let x = 0; x < requestBody.products.length; x++){

				// CHECK IF PRODUCT ID IS INVALID:
				if (requestBody.products[x].productId.length !== 24) {
					return {
						status: false,
						message: `Product ID of Item No. ${x} is invalid.`
					}
				// IF PRODUCT ID IS VALID:
				}else {

					// GET PRODUCT PRICES
					await Product.findById(requestBody.products[x].productId)
					.then(result2 => {

						// CHECK IF PRODUCT IS ALREADY IN THE CART
						let index = newCart.products.findIndex( item => item.productId === requestBody.products[x].productId);

						if (index >= 0) {
							newCart.products[index].quantity += requestBody.products[x].quantity;
							newCart.products[index].subtotal += result2.price*requestBody.products[x].quantity;
							newCart.totalAmount += result2.price*requestBody.products[x].quantity;
						}else{
						// IF PRODUCT IS NOT YET IN THE CART
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

							// DEDUCT QUANTITY FROM STOCKS
							Product.findByIdAndUpdate(requestBody.products[x].productId, {
								stocks: result2.stocks - requestBody.products[x].quantity
							})
							.then((updatedProductStocks, error) => {
								if (error) {
									return {
										status: false,
										message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
									}
								}else{
									return {
										status: true,
										message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
									}
								}
							})
						}						
					})
				}
			};

			// SAVE TO DATABASE
			return newCart.save()
			.then((newCart, error) => {
				if(error){
					return {
						status: false,
						message: `Error in creating cart.`
					}
				}else{
					return {
						status: true,
						message: `New cart for (${newCart.customerName}) was successfully created!`
					}
				}
			});
		}

		// IF THERE IS EXISTING CART, ADD PRODUCTS TO THE EXISTING CART -------------------------------------------------------
		else{
			// ADD PRODUCTS TO CART
			for(let x = 0; x < requestBody.products.length; x++){

				// CHECK IF PRODUCT ID IS INVALID:
				if (requestBody.products[x].productId.length !== 24) {
					return {
						status: false,
						message: `Product ID of Item No. ${x} is invalid.`
					}

				// IF PRODUCT ID IS VALID:
				}else{
					// GET PRODUCT PRICES
					await Product.findById(requestBody.products[x].productId)
					.then(result3 => {

						// CHECK IF PRODUCT IS ALREADY IN THE CART
						let index = existingCart[0].products.findIndex( item => item.productId === requestBody.products[x].productId);

						if (index >= 0) {
							existingCart[0].products[index].quantity += requestBody.products[x].quantity;
							existingCart[0].products[index].subtotal += result3.price*requestBody.products[x].quantity;
							existingCart[0].totalAmount += result3.price*requestBody.products[x].quantity;
						}else{
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
							// DEDUCT QUANTITY FROM STOCKS
							Product.findByIdAndUpdate(requestBody.products[x].productId, {
								stocks: result3.stocks - requestBody.products[x].quantity
							})
							.then((updatedProductStocks, error) => {
								if (error) {
									return {
										status: false,
										message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
									}
								}else{
									return {
										status: true,
										message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
									}
								}
							})
						}
						
					})
				}
				
			}

			return existingCart[0].save()
			.then((updatedCart, error) => {
				if (error) {
					return {
						status: false,
						message: `Failed to add products to (${customer.fullName})\'s cart.`
					}
				}else{
					return {
						status: true,
						message: `Products were successfully added to (${customer.fullName})\'s cart.`
					}
				}
			});
		}
		
	}

};

// ADD TO CART: SINGLE
// CREATE CART: NON-ADMIN ONLY
module.exports.addToCart = async (customer, requestBody) => {
	
	
		let existingCart = await Cart.find({userId : customer.userId})
		.then(cart => {
			return cart;
		});
		
		// IF NO EXISTING CART, CREATE NEW CART-------------------------------------------------------
		if (existingCart.length === 0) {
			let newCart = new Cart({
				userId: customer.userId,
				customerName: customer.fullName
			})

			// ADD PRODUCTS TO CART
			// GET PRODUCT PRICES
			await Product.findById(requestBody.productId)
			.then(result2 => {

				// CHECK IF PRODUCT IS ALREADY IN THE CART
				let index = newCart.products.findIndex( item => item.productId === requestBody.productId);

				if (index >= 0) {
					newCart.products[index].quantity += 1;
					newCart.products[index].subtotal += result2.price;
					newCart.totalAmount += result2.price;
				}else{
				// IF PRODUCT IS NOT YET IN THE CART
					newCart.products.push({
						// PUSH PRODUCT DETAILS TO ARRAY
						productId: requestBody.productId,
						productName: result2.name,
						productPrice: result2.price,
						productImageLink: result2.imageLink,
						quantity: 1,
						// COMPUTE FOR SUBTOTAL: PER PRODUCT
						subtotal: result2.price
					})
					// COMPUTE FOR TOTAL AMOUNT OF ITEMS IN CART
					newCart.totalAmount += result2.price;

					// DEDUCT QUANTITY FROM STOCKS
					Product.findByIdAndUpdate(requestBody.productId, {
						stocks: result2.stocks-1
					})
					.then((updatedProductStocks, error) => {
						if (error) {
							return {
								status: false,
								message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
							}
						}else{
							return {
								status: true,
								message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
							}
						}
					})
				}						
			})


			// SAVE TO DATABASE
			return newCart.save()
			.then((newCart, error) => {
				if(error){
					return {
						status: false,
						message: `Error in creating cart.`
					}
				}else{
					return {
						status: true,
						message: `New cart for (${newCart.customerName}) was successfully created!`
					}
				}
			});
		}

		// IF THERE IS EXISTING CART, ADD PRODUCTS TO THE EXISTING CART -------------------------------------------------------
		else{
			// ADD PRODUCTS TO CART
			// GET PRODUCT PRICES
			await Product.findById(requestBody.productId)
			.then(result3 => {

				// CHECK IF PRODUCT IS ALREADY IN THE CART
				let index = existingCart[0].products.findIndex( item => item.productId === requestBody.productId);

				if (index >= 0) {
					existingCart[0].products[index].quantity += 1;
					existingCart[0].products[index].subtotal += result3.price;
					existingCart[0].totalAmount += result3.price;

					// DEDUCT QUANTITY FROM STOCKS
					Product.findByIdAndUpdate(requestBody.productId, {
						stocks: result3.stocks-1
					})
					.then((updatedProductStocks, error) => {
						if (error) {
							return {
								status: false,
								message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
							}
						}else{
							return {
								status: true,
								message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
							}
						}
					})
					
				}else{
					existingCart[0].products.push({
						// PUSH PRODUCT DETAILS TO ARRAY
						productId: requestBody.productId,
						productName: result3.name,
						productImageLink: result3.imageLink,
						productPrice: result3.price,
						quantity: 1,
						// COMPUTE FOR SUBTOTAL: PER PRODUCT
						subtotal: result3.price
					})					
					// COMPUTE FOR TOTAL AMOUNT OF ITEMS IN CART
					existingCart[0].totalAmount += result3.price;
					// DEDUCT QUANTITY FROM STOCKS
					Product.findByIdAndUpdate(requestBody.productId, {
						stocks: result3.stocks-1
					})
					.then((updatedProductStocks, error) => {
						if (error) {
							return {
								status: false,
								message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
							}
						}else{
							return {
								status: true,
								message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
							}
						}
					})
				}
				
			})

			return existingCart[0].save()
			.then((updatedCart, error) => {
				if (error) {
					return {
						status: false,
						message: `Failed to add products to (${customer.fullName})\'s cart.`
					}
				}else{
					return {
						status: true,
						message: `Products were successfully added to (${customer.fullName})\'s cart.`
					}
				}
			});
		}
		
	

};

// USER VIEW CART
module.exports.viewCart = async (customer) => {
	if (customer.isAdmin) {
		let message = Promise.resolve(`Admins do not have cart.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	} else {
		return await Cart.find({userId : customer.userId})
		.then(result => {
			if(result.length === 0){
				return {
					status: false,
					message: `Cart is empty.`
				}
			}else{
				return {
					status: true,
					itemCount: result[0].products.length,
					details: result
				}
			}
		});
	}
}