const { UserModel, PasswordRecoveryTokenModel } = require("../models/models")
const MailService = require("./mail-service")
const ApiError = require("../exceptions/api-error")
const bcrypt = require("bcrypt")

class DataRecoveryService {
    async passwordRecoveryRequest(email) {
        if (!email) {
            throw ApiError.BadRequest("email field is empty")
        }

        const token = await PasswordRecoveryTokenModel.findOne({
            where: { email },
        })
        if (token) {
            token.destroy()
        }

        const recoveryToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString()
        const hashedToken = await bcrypt.hash(recoveryToken, 4)

        await PasswordRecoveryTokenModel.create({
            email,
            recoveryToken: hashedToken,
        })

        await MailService.sendPasswordRecoveryMail(email, recoveryToken)

        return { message: "Token was sent successfully" }
    }

    async passwordRecovery(newPassword, email) {
        if (!newPassword) {
            throw ApiError.BadRequest("newPassword field is empty")
        }

        const passwordRecoveryToken = await PasswordRecoveryTokenModel.findOne({
            where: { email },
        })
        if (!passwordRecoveryToken) {
            throw ApiError.BadRequest("InvalidPasswordRecoveryToken")
        }

        const user = await UserModel.findOne({ where: { email } })

        const hashedPassword = await bcrypt.hash(newPassword, 4)
        user.password = hashedPassword
        user.save()

        passwordRecoveryToken.destroy()

        return { message: "Password recovery was successful" }
    }
}

module.exports = new DataRecoveryService()
