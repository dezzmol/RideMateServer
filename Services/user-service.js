const UserModel = require("../models/models")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const MailService = require("./mail-service")
const TokenService = require("./token-service")
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")

class UserService {
    async registration(email, name, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw new Error("Users with this email already exist")
        }
        const hashPassword = await bcrypt.hash(password, 4);
        const activationLink = uuid.v4()

        const user = await UserModel.create({email, name, password: hashPassword, activationLink})
        await MailService.sendActivationMail(email, activationLink);

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