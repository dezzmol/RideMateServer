const { UserModel, PasswordRecoveryTokenModel } = require("../models/models")
const MailService = require("./mail-service")
const ApiError = require("../exceptions/api-error")
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")
const cron = require("node-cron")

class DataRecoveryService {
    async verifyToken(passwordRecoveryToken, email) {
        if (!passwordRecoveryToken) {
            throw ApiError.BadRequest("passwordRecoveryToken field is empty")
        }
        if (!email) {
            throw ApiError.BadRequest("email field is empty")
        }

        const recoveryToken = await PasswordRecoveryTokenModel.findOne({
            where: { email },
        })
        if (!recoveryToken) {
            throw ApiError.BadRequest("invalidPasswordRecoveryToken")
        }

        const isValid = await bcrypt.compare(
            passwordRecoveryToken,
            recoveryToken.recoveryToken
        )
        if (!isValid) {
            throw ApiError.BadRequest("invalidPasswordRecoveryToken")
        }

        return { message: "Token for password recovery is valid" }
    }

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
            throw ApiError.BadRequest("invalidPasswordRecoveryToken")
        }

        const user = await UserModel.findOne({ where: { email } })

        const hashedPassword = await bcrypt.hash(newPassword, 4)
        user.password = hashedPassword
        user.save()

        passwordRecoveryToken.destroy()

        return { message: "Password recovery was successful" }
    }
}

const deleteToken = async () => {
    await PasswordRecoveryTokenModel.destroy({
        where: {
            createdAt: { [Op.lte]: new Date(Date.now() - 60 * 30 * 1000) },
        },
    })
}

cron.schedule("* * * * *", deleteToken)

module.exports = new DataRecoveryService()
