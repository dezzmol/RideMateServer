const { UserModel } = require("../models/models")
const MailService = require("./mail-service")
const UserDto = require("../dtos/user-dto")
const TokenService = require("./token-service")
const uuid = require("uuid")
const ApiError = require("../exceptions/api-error")

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

        const activationLink = uuid.v4()

        const user = await UserModel.findOne({ where: { id: userId } })
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
}

module.exports = new DataChangeService()
