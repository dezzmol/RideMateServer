const Router = require("express")
const router = Router()
const ScheduleController = require("../controllers/schedule-controller")

router.get("/:id", ScheduleController.getSchedule)
router.post("/", ScheduleController.setBookingDates)

module.exports = router
