// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const User = require("../models/User.js");


// FUNCTIONS------------------------------------------------------------------------

// USER REGISTRATION
module.exports.registerUser = async (requestBody) => {

	let existingAccount = await User.find({email : requestBody.email})
	.then(account => {
		return account;
	});

	if (existingAccount.length === 0) {

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
				return `Error in registering new user.`;
			}else{
				return `New user (${newUser.firstName} ${newUser.lastName}) successfully registered.`;
			}
		});
	}else{
		let message = Promise.resolve(`Sorry, the email (${requestBody.email}) is already used in an existing account.`);

		return message.then((value) => {
			return value;
		});
	}

};


// USER LOGIN
module.exports.loginUser = (requestBody) =>{

	return User.findOne({email : requestBody.email})
	.then(result => {

		if (result == null) {
			return `Sorry. User not found. Please register first.`;
		}else{
			const isPasswordCorrect = bcrypt.compareSync(requestBody.password, result.password)

			if(isPasswordCorrect){
				let access = auth.createAccessToken(result);
				return `Hi ${result.firstName} ${result.lastName}! Welcome to E-Commerce API. \n ACCESS TOKEN: \n ${access}`;
			}else{
				return `Sorry. Email and Password does not match.`;
			}
		}
	});

};


// USER DETAILS: SINGLE
module.exports.getUserDetails = (userId) => {

	return User.findById(userId)
	.then(result => {
		if (result == null) {
			return `Sorry. User not found.`;
		}else{
			result.password = ``;
			return result;
		}
	})

};


// USER SET AS ADMIN: ADMIN ONLY
module.exports.addAdmin = (isAdmin, newAdminUserId) => {

	if (isAdmin) {
		return User.findByIdAndUpdate(newAdminUserId, {
			isAdmin: true
		})
		.then((newAdmin, error) => {
			if (error) {
				return `Failed to set user (${newAdmin.firstName} ${newAdmin.lastName}) as admin.`;
			}else{
				return `User (${newAdmin.firstName} ${newAdmin.lastName}) successfully set as admin.`;
			}
		})
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be admin to set other users as admin.`);

		return message.then((value) => {
			return value;
		});
	}

};