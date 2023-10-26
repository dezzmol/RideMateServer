const { UserModel, PasswordChangeTokenModel } = require("../models/models")
const MailService = require("./mail-service")
const TokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const crypto = require("crypto")

class DataChangeService {
    async changeEmail(userId, password, newEmail) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!password) {
            throw ApiError.BadRequest("password field is empty")
        }
        if (!newEmail) {
            throw ApiError.BadRequest("newEmail field is empty")
        }

        const user = await UserModel.findOne({ where: { id: userId } })
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest("incorrectPassword")
        }

        const activationLink = uuid.v4()
        user.email = newEmail
        user.activationLink = activationLink
        user.isActivated = false
        user.save()

        await MailService.sendActivationMail(
            newEmail,
            `${process.env.API_URL}/api/user/activate/${activationLink}`
        )

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({ ...userDto })
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userDto,
        }
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

        const resetToken = crypto.randomBytes(32).toString("hex")
        const hashedToken = await bcrypt.hash(resetToken, 4)

        await PasswordChangeTokenModel.create({
            userId,
            changeToken: hashedToken,
        })

        const link = `${process.env.API_URL}/passwordChange?changeToken=${resetToken}&userId=${user.id}`

        await MailService.sendPasswordChangeMail(user.email, user.name, link)

        return link
    }

    async changePassword(userId, changeToken, password, newPassword) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!changeToken) {
            throw ApiError.BadRequest("changeToken field is empty")
        }
        if (!password) {
            throw ApiError.BadRequest("password field is empty")
        }
        if (!newPassword) {
            throw ApiError.BadRequest("newPassword field is empty")
        }

        const passwordChangeToken = await PasswordChangeTokenModel.findOne({
            where: { userId },
        })
        if (!passwordChangeToken) {
            throw ApiError.BadRequest("Invalid password reset token")
        }

        const isValid = await bcrypt.compare(
            changeToken,
            passwordChangeToken.changeToken
        )
        if (!isValid) {
            throw new Error("Invalid password reset token")
        }

        const user = await UserModel.findOne({ where: { id: userId } })
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest("incorrectPassword")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 4)
        user.password = hashedPassword
        user.save()

        passwordChangeToken.destroy()

        return { message: "Password change was successful" }
    }
}

module.exports = new DataChangeService()
