const {
    UserModel,
    PasswordChangeTokenModel,
    EmailChangeTokenModel,
    PasswordRecoveryTokenModel,
} = require("../models/models")
const MailService = require("./mail-service")
const ApiError = require("../exceptions/api-error")
const bcrypt = require("bcrypt")
const uuid = require("uuid")

class DataChangeService {
    async verifyToken(emailChangeToken, passwordChangeToken, userId) {
        if (emailChangeToken) {
            const changeToken = await EmailChangeTokenModel.findOne({
                where: { userId },
            })
            if (!changeToken) {
                throw ApiError.BadRequest("invalidEmailToken")
            }

            const isValid = await bcrypt.compare(
                emailChangeToken,
                changeToken.changeToken
            )
            if (!isValid) {
                throw ApiError.BadRequest("invalidEmailToken")
            }

            return { message: "Token for email change is valid" }
        }

        if (passwordChangeToken) {
            const changeToken = await PasswordChangeTokenModel.findOne({
                where: { userId },
            })
            if (!changeToken) {
                throw ApiError.BadRequest("invalidPasswordToken")
            }

            const isValid = await bcrypt.compare(
                passwordChangeToken,
                changeToken.changeToken
            )
            if (!isValid) {
                throw ApiError.BadRequest("invalidPasswordToken")
            }

            return { message: "Token for password change is valid" }
        }
    }

    async changeEmailRequest(userId) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        const user = await UserModel.findOne({ where: { id: userId } })

        const token = await EmailChangeTokenModel.findOne({
            where: { userId: user.id },
        })
        if (token) {
            token.destroy()
        }

        const changeToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString()
        const hashedToken = await bcrypt.hash(changeToken, 4)

        await EmailChangeTokenModel.create({
            userId,
            changeToken: hashedToken,
        })

        await MailService.sendEmailChangeMail(
            user.email,
            user.name,
            changeToken
        )

        return { message: "Token was sent successfully" }
    }

    async changeEmail(userId, newEmail) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!newEmail) {
            throw ApiError.BadRequest("newEmail field is empty")
        }

        const emailChangeToken = await EmailChangeTokenModel.findOne({
            where: { userId },
        })
        if (!emailChangeToken) {
            throw ApiError.BadRequest("InvalidEmailToken")
        }

        const candidate = await UserModel.findOne({
            where: { email: newEmail },
        })
        if (candidate) {
            throw ApiError.BadRequest("userExists")
        }

        const user = await UserModel.findOne({ where: { id: userId } })

        const activationLink = uuid.v4()
        user.email = newEmail
        user.activationLink = activationLink
        user.isActivated = false
        user.save()

        const link = `${process.env.API_URL}/api/user/activate/${activationLink}`

        await MailService.sendActivationMail(newEmail, link)

        emailChangeToken.destroy()

        return { message: "Email change was successful" }
    }

    async changePasswordRequest(userId) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }

        const user = await UserModel.findOne({ where: { id: userId } })
        const token = await PasswordChangeTokenModel.findOne({
            where: { userId: user.id },
        })
        if (token) {
            token.destroy()
        }

        const changeToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString()
        const hashedToken = await bcrypt.hash(changeToken, 4)

        await PasswordChangeTokenModel.create({
            userId,
            changeToken: hashedToken,
        })

        await MailService.sendPasswordChangeMail(
            user.email,
            user.name,
            changeToken
        )

        return { message: "Token was sent successfully" }
    }

    async changePassword(userId, newPassword) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!newPassword) {
            throw ApiError.BadRequest("newPassword field is empty")
        }

        const passwordChangeToken = await PasswordChangeTokenModel.findOne({
            where: { userId },
        })
        if (!passwordChangeToken) {
            throw ApiError.BadRequest("InvalidPasswordToken")
        }

        const user = await UserModel.findOne({ where: { id: userId } })

        const hashedPassword = await bcrypt.hash(newPassword, 4)
        user.password = hashedPassword
        user.save()

        passwordChangeToken.destroy()

        return { message: "Password change was successful" }
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

        return recoveryToken
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

module.exports = new DataChangeService()
