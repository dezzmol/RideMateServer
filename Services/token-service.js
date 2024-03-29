const jsonwt = require("jsonwebtoken")
const { TokenModel, UserModel } = require("../models/models")

class TokenService {
    generateTokens(payload) {
        const accessToken = jsonwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY,
            { expiresIn: "30m" }
        )
        const refreshToken = jsonwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: "30d" }
        )
        return {
            accessToken,
            refreshToken,
        }
    }

    generateAccessToken(payload) {
        const accessToken = jsonwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY,
            { expiresIn: "30m" }
        )

        return accessToken
    }

    validateAccessToken(token) {
        try {
            const userData = jsonwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET_KEY
            )
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jsonwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET_KEY
            )
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { userId } })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            const user = await UserModel.findOne({ where: { id: userId } })
            user.tokenId = tokenData.id
            user.save()
            return tokenData
        }
        const token = await TokenModel.create({ userId, refreshToken })
        const user = await UserModel.findOne({ where: { id: userId } })
        user.tokenId = token.id
        user.save()
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.destroy({ where: { refreshToken } })
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { refreshToken } })
        return tokenData
    }
}

module.exports = new TokenService()
