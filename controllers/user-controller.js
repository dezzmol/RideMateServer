const UserService = require("../Services/user-service")

class UserController {
    async registration(req, res, next) {
        try {
            const {email, name, password} = req.body;
            const userData = await UserService.registration(email, name, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            console.log(e);
        }
    }

    async login(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async logout(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async refresh(req, res, next) {
        try {
            return res.json("adada")
        } catch (e) {
            
        }
    }

    async activate(req, res, next) {
        try {

        } catch (e) {
            
        }
    }
}

module.exports = new UserController()