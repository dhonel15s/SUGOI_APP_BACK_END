// DEPENDENCIES
const jwt = require("jsonwebtoken");
const secret = "ECommerceAPI";


// TOKEN CREATION
module.exports.createAccessToken = (user) => {
	
	const data = {
		id: user._id,
		fullName: `${user.firstName} ${user.lastName}`,
		email: user.email,
		isAdmin: user.isAdmin
	}

	return jwt.sign(data, secret, {});
};


// TOKEN VERIFICATION
module.exports.verify = (request, response, next) => {

	let token = request.headers.authorization;

	if(typeof token !== "undefined"){
		token = token.slice(7, token.length);
	

		return jwt.verify(token, secret, (error, data) => {
			if (error){
				return response.send({
					auth: `Token validation failed.`
				});
			}else{
				next();
			}
		})

	}else{
		return response.send(`Token undefined. Please input access token.`);
	}
}


// TOKEN DECODE
module.exports.decode = (token) => {

	if (typeof token !== "undefined") {

		token = token.slice(7, token.length);

		return jwt.verify(token, secret, (error, data) => {
			if (error) {
				return null;
			}else{
				return jwt.decode(token, {complete: true}).payload;
			}
		})
	}else{
		return null;
	}
}