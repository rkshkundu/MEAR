const jwt = require('jsonwebtoken');

const apiError = require('../models/api-error');

const validateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // authorization = 'Bearer TOKEN_VALUE'

        if(!token) {
            throw new Error('Authentication failed as there is no token in api call!!!');
        }

        const decodedToken = jwt.verify(token, 'secRet_Key_noT_to_SaHre');
        req.userData = {userId: decodedToken.userId};
        next();

    } catch(error) {
        return next(
			apiError(`Authentication failed!!! ${error}`, 401)
		);
    }
	
};

module.exports = validateToken;
