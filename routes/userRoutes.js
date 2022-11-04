// DEPENDENCIES: Modules
const express = require("express");
const router = express.Router();


// DEPENDENCIES: Local
const User =  require("../models/User.js");
const userController =  require("../controllers/userController.js");
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


// EXPORT USER ROUTES
module.exports = router;