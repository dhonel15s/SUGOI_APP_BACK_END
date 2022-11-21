// DEPENDENCIES: Modules
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


// DEPENDENCIES: Local
const User = require("../models/User.js");


// FUNCTIONS------------------------------------------------------------------------

// USER REGISTRATION
module.exports.registerUser = async (requestBody) => {

	let existingAccount = await User.find({email : requestBody.email});

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
				return {
					status: false,
					message: `Error occurred while registering new user.`
				}
			}else{
				return {
					status: true,
					message: `New user (${newUser.firstName} ${newUser.lastName}) successfully registered.`
				};
			}
		});
	}else{
		return {
			status: false,
			isExisting: true,
			message: `Sorry, the email (${requestBody.email}) is already used in an existing account.`
		};

	}

};


// USER LOGIN
module.exports.loginUser = (requestBody) =>{

	return User.findOne({email : requestBody.email})
	.then(result => {

		if (result == null) {
			return {
				status: false,
				message: `Sorry. User not found. Please register first.`
			};
		}else{
			const isPasswordCorrect = bcrypt.compareSync(requestBody.password, result.password)

			if(isPasswordCorrect){
				
				
				// CREATE ACCESS TOKEN
				let access = auth.createAccessToken(result);
				return {
					status: true,
					message: `Hi ${result.firstName} ${result.lastName}! Welcome to Sugoi! Flavors of Japan.`,
					userId: result.id,
					isAdmin: result.isAdmin,
					accessToken: access
				};
			}else{
				return {
					status: false,
					message: `Sorry. Email and Password does not match.`
				};
			}
		}
	});

};



// CHECK IF EMAIL IS EXISTING
module.exports.checkEmail = (requestBody) =>{
	return User.find({email : requestBody.email})
	.then(result => {
		// IF NO RESULTS, THEN NOT EXISTING
		if (result.length === 0) {
			return {
				status: false,
				message: `Email not yet used.`
			}
		}
		// IF THERE IS RESULT, THEN EXISTING
		else{
			return {
				status: true,
				message: `Email already in use. Please use different email.`
			}
		}
	})
}




// USER DETAILS: SINGLE
module.exports.getUserDetails = (userId) => {

	// CHECK PARAMS ID IF VALID
	if(userId.length === 24){

		// IF VALID, SEARCH IN DATABASE
		return User.findById(userId)
		.then(result => {
			// IF ID HAS NO MATCH
			if (result === null) {
				return {
					status: false,
					message: `User not found.`
				};
			// IF ID HAS A MATCH
			}else{
				result.password = ``;
				return {
					status: true,
					message: `(${result.firstName} ${result.lastName}) Account Details`,
					details: result
				}
			}
		});
	// IF PARAMS ID IS INVALID
	}else{
		let message = Promise.resolve(`The userID in url is invalid.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			};
		});

	}

};


// USER SET AS ADMIN: ADMIN ONLY
module.exports.addAdmin = (isAdmin, newAdminUserId) => {

	// CHECK IF ADMIN
	if (isAdmin) {

		// CHECK PARAMS ID 
		//IF PARAMS ID IS VALID
		if(newAdminUserId.length === 24){

			// SEARCH IN DATABASE
			return User.findById(newAdminUserId)
			.then(result => {
				// IF ID HAS NO MATCH
				if (result === null) {
					return {
						status: false,
						message: `User not found.`
					};
				// IF ID HAS A MATCH
				}else{

					// IF USER IS ALREADY AN ADMIN, DO NOT PROCEED
					if (result.isAdmin === true) {
						return {
							status: false,
							message: `Sorry, (${result.firstName} ${result.lastName}) is already an admin.`
						}
					// IF USER IS NOT YET ADMIN, PROCEED	
					}else{
						return User.findByIdAndUpdate(newAdminUserId, {isAdmin: true})
						.then((newAdmin, error) => {
							if (error) {
								return {
									status: false,
									message: `Failed to set user (${newAdmin.firstName} ${newAdmin.lastName}) to admin.`
								};
							}else{
								return {
									status: true,
									message: `User (${newAdmin.firstName} ${newAdmin.lastName}) was successfully set to admin.`
								};
							}
						})
					}
					
				}
		})
		// IF PARAMS ID IS INVALID
		}else{
			let message = Promise.resolve(`The userID in url is invalid.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				};
			});
		}

	// IF NOT ADMIN 
	}else{

		let message = Promise.resolve(`Sorry. This feature is for admins only`);
		return message.then((value) => {
			return {
				status: false,
				message: value
			};
		});
	}

};



// UPDATE ACCOUNT DETAILS
module.exports.updateAccountInfo = async (userId, requestBody) => {
	// GET ORIGINAL USER DETAILS
	let originalInfo = await User.findById(userId);

	return await User.findByIdAndUpdate(userId, {
		firstName: requestBody.firstName,
		lastName: requestBody.lastName,
		email: requestBody.email
	})
	.then((updatedUser, error) => {
		if (error) {
			return {
				status: false,
				message: `Failed to update user (${originalInfo.firstName} ${originalInfo.lastName}) account details.`
			};
		}else{
			return {
				status: true,
				message: `Account details of (${originalInfo.firstName} ${originalInfo.lastName}) was successfully updated.`,
				details: updatedUser

			};
		}
	})
};



// CHANGE ACCOUNT PASSWORD
module.exports.changePassword = async (userId, requestBody) => {

	let user = await User.findById(userId);

	// CHECK IF OLD PASSWORD MATCHES DATABASE
	const isOldPasswordCorrect = bcrypt.compareSync(requestBody.oldPassword, user.password)

	// IF OLD PASSWORD IS CORRECT
	if (isOldPasswordCorrect) {
		return User.findByIdAndUpdate(userId, {
			password: bcrypt.hashSync(requestBody.newPassword, 10)
		})
		.then((updatedUser, error) => {
			if (error) {
				return {
					status: false,
					message: `Failed to change user (${user.firstName} ${user.lastName})'s password.`
				};
			}else{
				return {
					status: true,
					message: `(${user.firstName} ${user.lastName})'s password was successfully changed.`
				};
			}
		})
	// IF OLD PASSWORD IS INCORRECT
	}else{
		return {
			status: false,
			message: `Sorry, old password is incorrect.`
		};
	}

}


// DEACTIVATE ACCOUNT
module.exports.deactivateAccount = async (userId, requestBody) => {

	let user = await User.findById(userId);

	// CHECK IF PASSWORD MATCHES DATABASE
	const isPasswordCorrect = bcrypt.compareSync(requestBody.password, user.password)

	// IF PASSWORD IS CORRECT
	if (isPasswordCorrect) {
		return User.findByIdAndDelete(userId)
		.then((deletedUser, error) => {
			if (error) {
				return {
					status: false,
					message: `Failed to deactivate user (${user.firstName} ${user.lastName}).`
				};
			}else{
				return {
					status: true,
					message: `(${user.firstName} ${user.lastName})'s account successfully deactivated.`
				};
			}
		})
	// IF PASSWORD IS INCORRECT
	}else{
		return {
			status: false,
			message: `Sorry, password is incorrect. Cannot proceed with deactivation.`
		};
	}

}
