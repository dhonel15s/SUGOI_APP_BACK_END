// DEPENDENCIES: Modules
const express = require("express");
const router = express.Router();


// DEPENDENCIES: Local
const Product =  require("../models/Product.js");
const productController =  require("../controllers/productController.js");
const auth = require("../auth.js");


// ROUTES--------------------------------------------------------------

// PRODUCT CREATION: ADMIN ONLY
router.post("/create", auth.verify, (request, response) => {
	const isAdmin = auth.decode(request.headers.authorization).isAdmin;
	productController.addProduct(request.body, isAdmin)
	.then(resultFromController => response.send(resultFromController));
});


// PRODUCT DISPLAY: ALL ACTIVE
router.get("/active", (request, response) => {
	productController.getActiveProducts()
	.then(resultFromController => response.send(resultFromController));
});


// PRODUCT DISPLAY: SINGLE PRODUCT
router.get("/:productId", (request, response) => {
	productController.getProductDetails(request.params.productId)
	.then(resultFromController => response.send(resultFromController));
});


// PRODUCT UPDATE INFO: ADMIN ONLY
router.put("/update/:productId", auth.verify, (request, response) => {
	const isAdmin = auth.decode(request.headers.authorization).isAdmin;
	productController.updateProduct(request.params.productId, isAdmin, request.body)
	.then(resultFromController => response.send(resultFromController));
});


// PRODUCT ARCHIVE: ADMIN ONLY
router.put("/archive/:productId", auth.verify, (request, response) => {
	const isAdmin = auth.decode(request.headers.authorization).isAdmin;
	productController.archiveProduct(request.params.productId, isAdmin)
	.then(resultFromController => response.send(resultFromController));
});


// EXPORT PRODUCT ROUTES
module.exports = router;