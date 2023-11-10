const {
    UserModel,
    PasswordChangeCodeModel,
    EmailChangeCodeModel,
} = require("../models/models")
const MailService = require("./mail-service")
const ApiError = require("../exceptions/api-error")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const { Op } = require("sequelize")
const cron = require("node-cron")

class DataChangeService {
    async verifyCode(emailChangeCode, passwordChangeCode, userId) {
        if (emailChangeCode) {
            const changeCode = await EmailChangeCodeModel.findOne({
                where: { userId },
            })
            if (!changeCode) {
                throw ApiError.BadRequest("invalidEmailCode")
            }

            const isValid = await bcrypt.compare(
                emailChangeCode,
                changeCode.changeCode
            )
            if (!isValid) {
                throw ApiError.BadRequest("invalidEmailCode")
            }

            return { message: "Code for email change is valid" }
        }

        if (passwordChangeCode) {
            const changeCode = await PasswordChangeCodeModel.findOne({
                where: { userId },
            })
            if (!changeCode) {
                throw ApiError.BadRequest("invalidPasswordCode")
            }

            const isValid = await bcrypt.compare(
                passwordChangeCode,
                changeCode.changeCode
            )
            if (!isValid) {
                throw ApiError.BadRequest("invalidPasswordCode")
            }

            return { message: "Code for password change is valid" }
        }
    }

    async changeEmailRequest(userId) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        const user = await UserModel.findOne({ where: { id: userId } })

        const code = await EmailChangeCodeModel.findOne({
            where: { userId: user.id },
        })
        if (code) {
            code.destroy()
        }

        const changeCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString()
        const hashedCode = await bcrypt.hash(changeCode, 4)

        await EmailChangeCodeModel.create({
            userId,
            changeCode: hashedCode,
        })

        await MailService.sendEmailChangeMail(user.email, user.name, changeCode)

        return { message: "Code was sent successfully" }
    }

    async changeEmail(userId, newEmail) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!newEmail) {
            throw ApiError.BadRequest("newEmail field is empty")
        }

        const emailChangeCode = await EmailChangeCodeModel.findOne({
            where: { userId },
        })
        if (!emailChangeCode) {
            throw ApiError.BadRequest("invalidEmailCode")
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

        emailChangeCode.destroy()

        return { message: "Email change was successful" }
    }

    async changePasswordRequest(userId) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }

        const user = await UserModel.findOne({ where: { id: userId } })
        const code = await PasswordChangeCodeModel.findOne({
            where: { userId: user.id },
        })
        if (code) {
            code.destroy()
        }

        const changeCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString()
        const hashedCode = await bcrypt.hash(changeCode, 4)

        await PasswordChangeCodeModel.create({
            userId,
            changeCode: hashedCode,
        })

        await MailService.sendPasswordChangeMail(
            user.email,
            user.name,
            changeCode
        )

        return { message: "Code was sent successfully" }
    }

    async changePassword(userId, newPassword) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!newPassword) {
            throw ApiError.BadRequest("newPassword field is empty")
        }

        const passwordChangeCode = await PasswordChangeCodeModel.findOne({
            where: { userId },
        })
        if (!passwordChangeCode) {
            throw ApiError.BadRequest("invalidPasswordCode")
        }

        const user = await UserModel.findOne({ where: { id: userId } })

        const hashedPassword = await bcrypt.hash(newPassword, 4)
        user.password = hashedPassword
        user.save()

        passwordChangeCode.destroy()

        return { message: "Password change was successful" }
    }
}

const deleteCode = async () => {
    await EmailChangeCodeModel.destroy({
        where: {
            createdAt: { [Op.lte]: new Date(Date.now() - 60 * 30 * 1000) },
        },
    })

    await PasswordChangeCodeModel.destroy({
        where: {
            createdAt: { [Op.lte]: new Date(Date.now() - 60 * 30 * 1000) },
        },
    })
}

cron.schedule("* * * * *", deleteCode)

module.exports = new DataChangeService()
