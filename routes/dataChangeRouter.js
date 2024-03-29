const Router = require("express")
const router = Router()
const DataChangeController = require("../controllers/data-change-controller")
const authMiddleware = require("../middlewares/auth-middleware")
const { body } = require("express-validator")

router.post("/verifyCode", authMiddleware, DataChangeController.verifyCode)
router.post(
    "/emailRequest",
    authMiddleware,
    DataChangeController.changeEmailRequest
)
router.put(
    "/email",
    body("newEmail").isEmail(),
    authMiddleware,
    DataChangeController.changeEmail
)
router.post(
    "/passwordRequest",
    authMiddleware,
    DataChangeController.changePasswordRequest
)
router.put(
    "/password",
    body("newPassword").isLength({ min: 5, max: 32 }),
    authMiddleware,
    DataChangeController.changePassword
)

module.exports = router
