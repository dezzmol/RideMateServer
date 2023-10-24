const Router = require("express")
const router = Router()
const HistoryController = require("../controllers/history-controller")


router.get("/:userId", HistoryController.getAll)

router.delete("/", HistoryController.cancelRental)


module.exports = router
