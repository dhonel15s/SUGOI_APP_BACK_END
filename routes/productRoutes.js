// DEPENDENCIES: Modules
const express = require("express");
const router = express.Router();


// DEPENDENCIES: Local
const Product =  require("../models/Product.js");
const productController =  require("../controllers/productController.js");
const auth = require("../auth.js");


// ROUTES--------------------------------------------------------------

// PRODUCT CREATION: ADMIN
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


// EXPORT PRODUCT ROUTES
module.exports = router;