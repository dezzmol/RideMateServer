const Router = require('express')
const router = Router()
const CarController = require("../controllers/car-controller")

router.get("/", CarController.getAll)
router.post("/", CarController.create)
router.get("/:id")
router.get("/schedule/:id", CarController.getSchedule)

module.exports = router