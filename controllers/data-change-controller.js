const DataChangeService = require("../Services/data-change-service")
const UserService = require("../Services/user-service")

class DataChangeController {
    async verifyCode(req, res, next) {
        try {
            const { id: userId } = req.user
            const { emailChangeCode, passwordChangeCode } = req.body

            const codeVerificationRes = await DataChangeService.verifyCode(
                emailChangeCode,
                passwordChangeCode,
                userId
            )

            return res.json(codeVerificationRes)
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
