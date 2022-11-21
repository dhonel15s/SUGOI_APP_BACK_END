// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const Product = require("../models/Product.js");


// FUNCTIONS-----------------------------------------------------------------------

// PRODUCT CREATION: ADMIN ONLY
module.exports.addProduct = async (requestBody, isAdmin) => {
	
	// CHECK IF ADMIN
	// IF ADMIN:
	if (isAdmin) {
		let existingProductName = await Product.find({ name : requestBody.name }); 

		// CHECK IF IDENTICAL PRODUCT NAME
		// IF NO IDENTICAL NAME FOUND:
		if (existingProductName.length === 0) {
			let newProduct = new Product({
				name: requestBody.name,
				category: requestBody.category,
				imageLink: requestBody.imageLink,
				description: requestBody.description,
				stocks: requestBody.stocks,
				price: requestBody.price
			})

			// IF STOCK IS 0, SET isActive to false
			if (newProduct.stocks === 0) {
				newProduct.isActive = false;
			}

			return newProduct.save()
			.then((newProduct, error) => {
				if (error) {
					return {
						status: false,
						message: `Failed to create product (${newProduct.name}).`
					}
				}else{
					return {
						status: true,
						message: `Product (${newProduct.name}) successfully created.`,
						details: newProduct
					}
				}
			});
		}else{
			// IF IDENTICAL PRODUCT NAME IS FOUND
			let message = Promise.resolve(`Identical product name found. Please change name to avoid confusion.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				}
			});
		}
		
	}else{
		// IF NOT ADMIN:
		let message = Promise.resolve(`User must be admin to create a product.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}

};


// PRODUCT DISPLAY: ALL ACTIVE
module.exports.getActiveProducts = () => {

	return Product.find({ isActive : true})
	.then(result => {
		if(result.length == 0){
			return {
				status: false,
				message: `No active products found.`
			}
		}else{
			return {
				status: true,
				message: `Active product/s found: ${result.length}`,
				productList: result
			}
		}
	});

};

// PRODUCT DISPLAY: ALL
module.exports.getAllProducts = () => {

	return Product.find({})
	.then(result => {
		return result;
	})

};


// PRODUCT DISPLAY: SINGLE PRODUCT
module.exports.getProductDetails = (productId) => {

	// CHECK PARAMS ID IF VALID
	if (productId.length === 24) {

		// IF PARAMS IS VALID: SEARCH IN DATABASE
		return Product.findById(productId)
		.then(result => {
			if(result == null){
				return {
					status: false,
					message: `Product not found.`
				}
			}else{
				return {
					status: true,
					message: `Product found.`,
					details: result
				}
			}
		});
	}else{
		// IF PARAMS IS INVALID
		let message = Promise.resolve(`The productID in url is invalid.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			};
		});
	}

};


// PRODUCT UPDATE INFO: ADMIN ONLY
module.exports.updateProduct = (productId, isAdmin, newData) => {

	// CHECK IF ADMIN
	if (isAdmin) {

		// IF ADMIN:CHECK PARAMS ID IF VALID
		if (productId.length === 24) {

			// IF PARAMS ID IS VALID
			return Product.findByIdAndUpdate(productId, {
				name: newData.name,
				description: newData.description,
				category: newData.category,
				imageLink: newData.imageLink,
				stocks: newData.stocks,
				price: newData.price,
				isActive: newData.isActive
			})
			.then((updatedProduct, error) => {
				if (error) {
					return {
						status: false,
						message:`Failed to update product (${updatedProduct.name}).`
					}
				}else{
					return {
						status: true,
						message: `Product (${updatedProduct.name}) successfully updated.`
					}
				}
			})


		}else{
			// IF PARAMS IS INVALID
			let message = Promise.resolve(`The productID in url is invalid.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				};
			});
		}

	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be admin to update a product.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			};
		});
	}

};


// PRODUCT ARCHIVE: ADMIN ONLY
module.exports.archiveProduct = (productId, isAdmin) => {

	// CHECK IF ADMIN
	if (isAdmin) {

		// IF ADMIN:CHECK PARAMS ID IF VALID
		if (productId.length === 24) {

			// SEARCH PRODUCT ID IN DATABASE
			return Product.findById(productId)
			.then(result => {
				// IF NO MATCH:
				if (result === null) {
					return {
						status: false,
						message: `Product not found`
					}
				}
				// IF MATCH FOUND:
				else{
					// CHECK IF PRODUCT IS ALREADY ARCHIVED
					if (result.isActive === false) {
						return {
							status: false,
							message: `Sorry, (${result.name}) is already archived.`
						}
					}
					// IF PRODUCT IS NOT YET ARCHIVED:
					else{

						return Product.findByIdAndUpdate(productId, {isActive: false})
						.then((archivedProduct, error) => {
							if (error) {
								return {
									status: false,
									message: `Failed to archive product (${archivedProduct.name}).`
								}
							}else{
								return {
									status: true,
									message: `Product (${archivedProduct.name}) successfully archived.`
								}
							}
						})
						return {
							status: true
						}
					}
				}
			})

		}else{
			// IF PARAMS IS INVALID
			let message = Promise.resolve(`The productID in url is invalid.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				};
			});
		}
		
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be admin to archive a product.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}

};

// PRODUCT UNARCHIVE: ADMIN ONLY
module.exports.unarchiveProduct = (productId, isAdmin) => {

	// CHECK IF ADMIN
	if (isAdmin) {

		// IF ADMIN:CHECK PARAMS ID IF VALID
		if (productId.length === 24) {

			// SEARCH PRODUCT ID IN DATABASE
			return Product.findById(productId)
			.then(result => {
				// IF NO MATCH:
				if (result === null) {
					return {
						status: false,
						message: `Product not found`
					}
				}
				// IF MATCH FOUND:
				else{
					// CHECK IF PRODUCT IS ALREADY ARCHIVED
					if (result.isActive === true) {
						return {
							status: false,
							message: `Sorry, (${result.name}) is already active.`
						}
					}
					// IF PRODUCT IS NOT YET ARCHIVED:
					else{

						return Product.findByIdAndUpdate(productId, {isActive: true})
						.then((unarchivedProduct, error) => {
							if (error) {
								return {
									status: false,
									message: `Failed to activate product (${unarchivedProduct.name}).`
								}
							}else{
								return {
									status: true,
									message: `Product (${unarchivedProduct.name}) successfully unarchived.`
								}
							}
						})
						return {
							status: true
						}
					}
				}
			})

		}else{
			// IF PARAMS IS INVALID
			let message = Promise.resolve(`The productID in url is invalid.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				};
			});
		}
		
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be admin to unarchive a product.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}

};