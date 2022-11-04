// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const User = require("../models/User.js");


// FUNCTIONS------------------------------------------------------------------------

// USER REGISTRATION
module.exports.registerUser = (requestBody) => {

	let newUser = new User({
		firstName: requestBody.firstName,
		lastName: requestBody.lastName,
		email : requestBody.email,
		password : bcrypt.hashSync(requestBody.password, 10),
		isAdmin : requestBody.isAdmin
	})

	return newUser.save()
	.then((newUser, error) => {
		if(error){
			return `Error in registering new user.`
		}else{
			return `New user (${newUser.firstName} ${newUser.lastName}) successfully registered.`
		}
	});

};


// USER LOGIN
module.exports.loginUser = (requestBody) =>{

	return User.findOne({email : requestBody.email})
	.then(result => {

		if (result == null) {
			return `Sorry. User not found. Please register first.`
		}else{
			const isPasswordCorrect = bcrypt.compareSync(requestBody.password, result.password)

			if(isPasswordCorrect){
				let access = auth.createAccessToken(result);
				return `Hi ${result.firstName} ${result.lastName}! Welcome to E-Commerce API. \n ACCESS TOKEN: \n ${access}`
			}else{
				return `Sorry. Email and Password does not match.`
			}
		}
	});

};