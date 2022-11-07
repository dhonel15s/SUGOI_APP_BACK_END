// DEPENDENCIES: Modules
const express = require("express");
const router = express.Router();


// DEPENDENCIES: Local
const User =  require("../models/User.js");
const userController =  require("../controllers/userController.js");
const orderController =  require("../controllers/orderController.js");
const cartController = require("../controllers/cartController.js");
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
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	orderController.createOrder(customer, request.body)
	.then(resultFromController => response.send(resultFromController));
});


// USER DETAILS: SINGLE
router.get("/userDetails/:userId", auth.verify, (request, response) => {
	userController.getUserDetails(request.params.userId)
	.then(resultFromController => response.send(resultFromController));
});


// USER SET AS ADMIN: ADMIN ONLY
router.put("/setAsAdmin/:newAdminUserId", auth.verify, (request, response) => {
	let isAdmin = auth.decode(request.headers.authorization).isAdmin

	userController.addAdmin(isAdmin, request.params.newAdminUserId)
	.then(resultFromController => response.send(resultFromController));
});


// GET ALL USER'S ORDERS
router.get("/myOrders", auth.verify, (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	orderController.getMyOrders(customer)
	.then(resultFromController => response.send(resultFromController));
});


// RETRIEVE ALL ORDERS: ADMIN ONLY
router.get("/orders", auth.verify, (request, response) => {
	let isAdmin = auth.decode(request.headers.authorization).isAdmin;

	orderController.getAllOrders(isAdmin)
	.then(resultFromController => response.send(resultFromController));
});


// ADD TO CART
router.post("/addToCart", auth.verify, (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin	
	}

	cartController.addToCart(customer, request.body)
	.then(resultFromController => response.send(resultFromController));
});

// VIEW CART
router.get("/viewcart", auth.verify, (request, response) => {
	let customer ={
		fullName: auth.decode(request.headers.authorization).fullName,
		userId: auth.decode(request.headers.authorization).id,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}
	cartController.viewCart(customer)
	.then(resultFromController => response.send(resultFromController));
});



// EXPORT USER ROUTES
module.exports = router;