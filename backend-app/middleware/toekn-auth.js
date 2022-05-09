//its a middleware to check if api is having token in header
const jwt = require('jsonwebtoken');

const apiError = require('../models/api-error');

const validateToken = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next(); //as request type options dont contain header
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // authorization = 'Bearer TOKEN_VALUE'

        if(!token) {
            return next( apiError(`Authentication failed as there is no token in api call!!!`, 401) );
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.userData = {userId: decodedToken.userId};
        next();

    } catch(error) {
        return next(
			apiError(`Authentication failed!!! ${error}`, 401)
		);
    }
	
};

module.exports = validateToken;
