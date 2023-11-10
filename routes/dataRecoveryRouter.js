const Router = require("express")
const router = Router()
const DataRecoveryController = require("../controllers/data-recovery-controller")
const { body } = require("express-validator")

router.post("/verifyCode", DataRecoveryController.verifyCode)
router.post("/passwordRequest", DataRecoveryController.passwordRecoveryRequest)
router.put(
    "/password",
    body("newPassword").isLength({ min: 5, max: 32 }),
    DataRecoveryController.passwordRecovery
)

module.exports = router
