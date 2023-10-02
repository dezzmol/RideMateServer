const {UserModel} = require("../models/models")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const MailService = require("./mail-service")
const TokenService = require("./token-service")
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error")

class UserService {
    async registration(email, name, password) {
        const candidate = await UserModel.findOne({where: {email}})
        if (candidate) {
            throw ApiError.BadRequest("Users with this email already exist")
        }
        const hashPassword = await bcrypt.hash(password, 4);
        const activationLink = uuid.v4()

        const user = await UserModel.create({email, name, password: hashPassword, activationLink})
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        
        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({where: {activationLink}})
        if (!user) {
            throw ApiError.BadRequest("Uncorrect link")
        }
        user.isActivated = true
        user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({where: {email}})
        if (!user) {
            throw ApiError.BadRequest("User with this email doesn't exist")
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest("Uncorrect password")
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }
}

module.exports = new UserService()