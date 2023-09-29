const jsonwt = require("jsonwebtoken")
const {TokenModel} = require("../models/models")

class TokenService {
    generateTokens(payload) {
        const accessToken = jsonwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: "30m"})
        const refreshToken = jsonwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: "30d"})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({where: {userId}})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await TokenModel.create({userId, refreshToken})
        return token
    }
}

module.exports = new TokenService()