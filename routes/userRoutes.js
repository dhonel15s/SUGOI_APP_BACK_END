// DEPENDENCIES: Modules
const express = require("express");
const router = express.Router();


// DEPENDENCIES: Local
const User =  require("../models/User.js");
const userController =  require("../controllers/userController.js");
const orderController =  require("../controllers/userController.js");
const auth = require("../auth.js")


// ROUTES--------------------------------------------------------------

// USER REGISTRATION
router.post("/register", (request, response) => {
	userController.registerUser(request.body)
	.then(resultFromController => response.send(resultFromController));
});


// USER LOGIN
router.post("/login", (request, response) => {
	userController.loginUser(request.body)
	.then(resultFromController => response.send(resultFromController));
});


// USER CHECKOUT: NON-ADMIN ONLY
router.post("/checkout", auth.verify , (request, response) => {
	const userId = auth.decode(request.headers.authorization).id;
	const isAdmin = auth.decode(request.headers.authorization).isAdmin;
	orderController.createOrder(userId, isAdmin, request.body)
	.then(resultFromController => response.send(resultFromController));
});


// EXPORT USER ROUTES
module.exports = router;