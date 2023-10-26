const DataChangeService = require("../Services/data-change-service")

class DataChangeController {
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
            const { password, changeToken, newEmail } = req.body

            const changeEmail = await DataChangeService.changeEmail(
                userId,
                password,
                changeToken,
                newEmail
            )

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
            const { changeToken, password, newPassword } = req.body

            const changePassword = await DataChangeService.changePassword(
                userId,
                changeToken,
                password,
                newPassword
            )

            return res.json(changePassword)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new DataChangeController()
