// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const Product = require("../models/Product.js");


// FUNCTIONS-----------------------------------------------------------------------
module.exports.addProduct = (requestBody, isAdmin) => {

	if (isAdmin) {
		let newProduct = new Product({
			name: requestBody.name,
			description: requestBody.description,
			price: requestBody.price
		})

		return newProduct.save()
		.then((newProduct, error) => {
			if (error) {
				return `Failed to create product (${newProduct.name}).`;
			}

			return `Product (${newProduct.name}) successfully created.`;
		});
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be admin to create a product.`);

		return message.then((value) => {
			return value;
		});
	}

};


module.exports.getActiveProducts = () => {
	return Product.find({ isActive : true})
	.then(result => {
		return result;
	});
}