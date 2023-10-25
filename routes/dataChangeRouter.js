const Router = require("express")
const router = Router()
const DataChangeController = require("../controllers/data-change-controller")
const authMiddleware = require("../middlewares/auth-middleware")
const { body } = require("express-validator")

router.put("/email", authMiddleware, DataChangeController.changeEmail)
router.put("/name")
router.put("/password")

module.exports = router
