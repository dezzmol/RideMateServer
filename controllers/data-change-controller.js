const DataChangeService = require("../Services/data-change-service")

class DataChangeController {
    async changeEmail(req, res, next) {
        try {
            const { id: userId } = req.user
            const { password, newEmail } = req.body

            const userData = await DataChangeService.changeEmail(
                userId,
                password,
                newEmail
            )

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.json({ token: userData.token })
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
