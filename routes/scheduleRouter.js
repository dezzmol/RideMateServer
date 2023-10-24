const Router = require("express")
const router = Router()
const ScheduleController = require("../controllers/schedule-controller")
const authMiddleware = require("../middlewares/auth-middleware")

router.get("/:id", ScheduleController.getSchedule)
router.post("/", authMiddleware, ScheduleController.setBookingDates)

module.exports = router
