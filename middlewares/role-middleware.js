const ApiError = require("../exceptions/api-error");
const TokenService = require("../services/token-service");

module.exports = function(role) {
    return async function(req, res, next) {
        try {
            const {token} = req.cookies

            const refreshToken = await TokenService.findToken(token)

            if (!refreshToken) {
                return next(ApiError.UnauthorizedError());
            }

            const userData = TokenService.validateRefreshToken(token)

            if (!userData) {
                return next(ApiError.UnauthorizedError())
            }

            if (userData.role !== role) {
                return next(ApiError.NoAccess())
            }

            req.user = userData;
            next();
        } catch (e) {
            return next(ApiError.UnauthorizedError());
        }
    }
}