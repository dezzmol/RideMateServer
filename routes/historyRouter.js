const Router = require("express")
const router = Router()
const HistoryController = require("../controllers/history-controller")
const authMiddleware = require("../middlewares/auth-middleware")

router.get("/", authMiddleware, HistoryController.getAll)
router.delete("/", authMiddleware, HistoryController.cancelRental)

module.exports = router
