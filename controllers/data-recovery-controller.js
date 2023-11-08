const DataRecoveryService = require("../Services/data-recovery-service")

class DataRecoveryController {
    async passwordRecoveryRequest(req, res, next) {
        try {
            const { email } = req.body

            const passwordRecoveryRequest =
                await DataRecoveryService.passwordRecoveryRequest(email)

            return res.json(passwordRecoveryRequest)
        } catch (e) {
            next(e)
        }
    }

    async passwordRecovery(req, res, next) {
        try {
            const { newPassword, email } = req.body

            const passwordRecoveryRes =
                await DataRecoveryService.passwordRecovery(newPassword, email)

            return res.json(passwordRecoveryRes)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new DataRecoveryController()
