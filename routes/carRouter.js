const Router = require("express")
const router = Router()
const CarController = require("../controllers/car-controller")

router.get("/", CarController.getAll)
router.post("/", CarController.create)
router.get("/:id", CarController.getOne)
router.put("/", CarController.remove)

module.exports = router
