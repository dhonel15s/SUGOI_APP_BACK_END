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

// CHECK REGISTRATION EMAIL
router.post("/checkEmail", (request, response) => {
	userController.checkEmail(request.body)
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

/*// ADD TO ORDER: SINGLE PRODUCT
router.post("/checkout/addToOrder", (request, response) => {
	orderController.addToOrder(request.body)
	.then(resultFromController => response.send(resultFromController));
});
*/

// USER DETAILS: SINGLE
router.get("/details", auth.verify, (request, response) => {
	userController.getUserDetails(auth.decode(request.headers.authorization).id)
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
router.post("/addToCartMany", auth.verify, (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin	
	}

	cartController.addToCartMany(customer, request.body)
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


// UPDATE ACCOUNT DETAILS
router.put("/updateAccountInfo", auth.verify, (request, response) => {
	let userId = auth.decode(request.headers.authorization).id;

	userController.updateAccountInfo(userId, request.body)
	.then(resultFromController => response.send(resultFromController));
});


// CHANGE ACCOUNT PASSWORD
router.put("/changePassword", auth.verify, (request, response) => {
	let userId = auth.decode(request.headers.authorization).id;

	userController.changePassword(userId, request.body)
	.then(resultFromController => response.send(resultFromController));
});


// DEACTIVATE ACCOUNT
router.delete("/deactivate", auth.verify, (request, response) => {
	let userId = auth.decode(request.headers.authorization).id;

	userController.deactivateAccount(userId, request.body)
	.then(resultFromController => response.send(resultFromController));
});


// ADD TO CART: SINGLE PRODUCT
router.post("/addToCart", auth.verify, (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName
	}

	cartController.addToCart(customer, request.body)
	.then(resultFromController => response.send(resultFromController));
});


// MODIFY PRODUCT DETAILS IN CART
router.put("/carts/update", (request, response) => {
	cartController.updateCart(request.body)
	.then(resultFromController => response.send(resultFromController));
});


// CLEAR CART
router.delete("/carts/clearcart", auth.verify, (request, response) => {
	cartController.clearCart(auth.decode(request.headers.authorization).id)
	.then(resultFromController => response.send(resultFromController));
});





// EXPORT USER ROUTES
module.exports = router;