const config = require('./../config/config');

module.exports = {
    authenticateRequest: (req, res, next) => {
        if (!config.auth || req.headers['x-api-key'] === config.apiAuthKey) {
            return next();
        }
        res
            .status(401)
            .send({
                status: 'ERROR',
                statusCode: 401,
                message: `Please mention correct value for X-API-KEY in request header.`
            });
    }
};