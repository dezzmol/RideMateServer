const UserService = require("../services/user-service")
const { validationResult, cookie } = require("express-validator")
const ApiError = require("../exceptions/api-error")

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest("Validation Error", errors.array())
                )
            }
            const { email, name, password } = req.body
            const userData = await UserService.registration(
                email,
                name,
                password
            )
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            return res.json({ token: userData.token })
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await UserService.login(email, password)
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            return res.json({ token: userData.token })
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie("refreshToken")
            return res.json({ message: "success" })
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            return res.json({ token: userData.token })
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await UserService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    async getData(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await UserService.getData(refreshToken)
            console.log(userData)
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async passwordCheck(req, res, next) {
        try {
            const { id: userId } = req.user
            const { password } = req.body

            const passwordCheckRes = await UserService.passwordCheck(
                userId,
                password
            )

            return res.json(passwordCheckRes)
        } catch (e) {
            next(e)
        }
    }

    async loginByRefreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies

            const accessToken = await UserService.loginByRefreshToken(
                refreshToken
            )

            return res.json(accessToken)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()
