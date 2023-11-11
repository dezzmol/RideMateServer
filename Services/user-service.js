const { UserModel } = require("../models/models")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const MailService = require("./mail-service")
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error")

class UserService {
    async registration(email, name, password) {
        const candidate = await UserModel.findOne({ where: { email } })
        if (candidate) {
            throw ApiError.BadRequest("userExists")
        }
        const hashPassword = await bcrypt.hash(password, 4)
        const activationLink = uuid.v4()

        const user = await UserModel.create({
            email,
            name,
            password: hashPassword,
            activationLink,
        })
        await MailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/user/activate/${activationLink}`
        )

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userDto,
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ where: { activationLink } })
        if (!user) {
            throw ApiError.BadRequest("IncorrectLink")
        }
        user.isActivated = true
        user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({ where: { email } })
        if (!user) {
            throw ApiError.BadRequest("userDoesntExist")
        }

        await this.passwordCheck(user.id, password)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userDto,
        }
    }

    async logout(refreshToken) {
        try {
            if (!refreshToken) {
                throw ApiError.BadRequest("Refresh token is undefined")
            }
            const token = await tokenService.removeToken(refreshToken)
            return token
        } catch (e) {
            throw ApiError.BadRequest(e.message)
        }
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const userDto = new UserDto(userData)

        const accessToken = tokenService.generateAccessToken({ ...userDto })

        return accessToken
    }

    async getData(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        if (!userData) {
            throw ApiError.UnauthorizedError()
        }

        const userDto = new UserDto(userData)

        return userDto
    }

    async passwordCheck(userId, password) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!password) {
            throw ApiError.BadRequest("password field is empty")
        }

        const user = await UserModel.findOne({ where: { id: userId } })

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest("incorrectPassword")
        }

        return { message: "Passwords match" }
    }
}

module.exports = new UserService()
