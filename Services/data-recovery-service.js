const { UserModel, PasswordRecoveryCodeModel } = require("../models/models")
const MailService = require("./mail-service")
const ApiError = require("../exceptions/api-error")
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")
const cron = require("node-cron")

class DataRecoveryService {
    async verifyCode(passwordRecoveryCode, email) {
        if (!passwordRecoveryCode) {
            throw ApiError.BadRequest("passwordRecoveryCode field is empty")
        }
        if (!email) {
            throw ApiError.BadRequest("email field is empty")
        }

        const recoveryCode = await PasswordRecoveryCodeModel.findOne({
            where: { email },
        })
        if (!recoveryCode) {
            throw ApiError.BadRequest("invalidPasswordRecoveryCode")
        }

        const isValid = await bcrypt.compare(
            passwordRecoveryCode,
            recoveryCode.recoveryCode
        )
        if (!isValid) {
            throw ApiError.BadRequest("invalidPasswordRecoveryCode")
        }

        return { message: "Code for password recovery is valid" }
    }

    async passwordRecoveryRequest(email) {
        if (!email) {
            throw ApiError.BadRequest("email field is empty")
        }

        const code = await PasswordRecoveryCodeModel.findOne({
            where: { email },
        })
        if (code) {
            code.destroy()
        }

        const recoveryCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString()
        const hashedCode = await bcrypt.hash(recoveryCode, 4)

        await PasswordRecoveryCodeModel.create({
            email,
            recoveryCode: hashedCode,
        })

        await MailService.sendPasswordRecoveryMail(email, recoveryCode)

        return { message: "Code was sent successfully" }
    }

    async passwordRecovery(newPassword, email) {
        if (!newPassword) {
            throw ApiError.BadRequest("newPassword field is empty")
        }

        const passwordRecoveryCode = await PasswordRecoveryCodeModel.findOne({
            where: { email },
        })
        if (!passwordRecoveryCode) {
            throw ApiError.BadRequest("invalidPasswordRecoveryCode")
        }

        const user = await UserModel.findOne({ where: { email } })

        const hashedPassword = await bcrypt.hash(newPassword, 4)
        user.password = hashedPassword
        user.save()

        passwordRecoveryCode.destroy()

        return { message: "Password recovery was successful" }
    }
}

const deleteCode = async () => {
    await PasswordRecoveryCodeModel.destroy({
        where: {
            createdAt: { [Op.lte]: new Date(Date.now() - 60 * 30 * 1000) },
        },
    })
}

cron.schedule("* * * * *", deleteCode)

module.exports = new DataRecoveryService()
