// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const Product = require("../models/Product.js");


// FUNCTIONS-----------------------------------------------------------------------

// PRODUCT CREATION: ADMIN ONLY
module.exports.addProduct = (requestBody, isAdmin) => {

	if (isAdmin) {
		let newProduct = new Product({
			name: requestBody.name,
			description: requestBody.description,
			category: requestBody.category,
			price: requestBody.price
		})

		return newProduct.save()
		.then((newProduct, error) => {
			if (error) {
				return `Failed to create product (${newProduct.name}).`;
			}

			return `Product (${newProduct.name}) successfully created.\nProduct Details:\n${newProduct}`;
		});
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be admin to create a product.`);

		return message.then((value) => {
			return value;
		});
	}

};


// PRODUCT DISPLAY: ALL ACTIVE
module.exports.getActiveProducts = () => {

	return Product.find({ isActive : true})
	.then(result => {
		if(result.length == 0){
			return `No active products found.`;
		}else{
			return `Active product/s found: ${result.length} \n ${result}`;
		}
	});

};


// PRODUCT DISPLAY: SINGLE PRODUCT
module.exports.getProductDetails = (productId) => {

	return Product.findById(productId)
	.then(result => {
		if(result == null){
			return `Product not found.`;
		}else{
			return `Product details:\n${result}`;
		}
	});

};


// PRODUCT UPDATE INFO: ADMIN ONLY
module.exports.updateProduct = (productId, isAdmin, newData) => {

	if (isAdmin) {
		return Product.findByIdAndUpdate(productId, {
			name: newData.name,
			description: newData.description,
			category: newData.category,
			price: newData.price
		})
		.then((updatedProduct, error) => {
			if (error) {
				return `Failed to update product (${updatedProduct.name}).`;
			}else{
				return `Product (${updatedProduct.name}) successfully updated.`;
			}
		})
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be admin to update a product.`);

		return message.then((value) => {
			return value;
		});
	}

};


// PRODUCT ARCHIVE: ADMIN ONLY
module.exports.archiveProduct = (productId, isAdmin) => {

	if (isAdmin) {
		return Product.findByIdAndUpdate(productId, {
			isActive: false
		})
		.then((archivedProduct, error) => {
			if (error) {
				return `Failed to archive product (${archivedProduct.name}).`;
			}else{
				return `Product (${archivedProduct.name}) successfully archived.`;
			}
		})
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be admin to archive a product.`);

		return message.then((value) => {
			return value;
		});
	}

};
