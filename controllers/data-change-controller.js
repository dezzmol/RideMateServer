const DataChangeService = require("../Services/data-change-service")
const UserService = require("../Services/user-service")
const { TokenModel } = require("../models/models")

class DataChangeController {
    async verifyToken(req, res, next) {
        try {
            const { id: userId } = req.user
            const { emailChangeToken, passwordChangeToken } = req.body

            const tokenVerificationRes = await DataChangeService.verifyToken(
                emailChangeToken,
                passwordChangeToken,
                userId
            )

            return res.json(tokenVerificationRes)
        } catch (e) {
            next(e)
        }
    }

    async changeEmailRequest(req, res, next) {
        try {
            const { id: userId } = req.user

            const requestEmailChange =
                await DataChangeService.changeEmailRequest(userId)

            return res.json(requestEmailChange)
        } catch (e) {
            next(e)
        }
    }

    async changeEmail(req, res, next) {
        try {
            const { id: userId } = req.user
            const { newEmail } = req.body

            const changeEmail = await DataChangeService.changeEmail(
                userId,
                newEmail
            )

            const { refreshToken } = req.cookies
            await UserService.logout(refreshToken)
            res.clearCookie("refreshToken")

            return res.json(changeEmail)
        } catch (e) {
            next(e)
        }
    }

    async changePasswordRequest(req, res, next) {
        try {
            const { id: userId } = req.user

            const requestPasswordChange =
                await DataChangeService.changePasswordRequest(userId)

            return res.json(requestPasswordChange)
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req, res, next) {
        try {
            const { id: userId } = req.user
            const { newPassword } = req.body

            const changePassword = await DataChangeService.changePassword(
                userId,
                newPassword
            )

            const { refreshToken } = req.cookies
            await UserService.logout(refreshToken)
            res.clearCookie("refreshToken")

            return res.json(changePassword)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new DataChangeController()
