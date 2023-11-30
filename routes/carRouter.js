const Router = require("express")
const router = Router()
const CarController = require("../controllers/car-controller")
const roleMiddleware = require("../middlewares/role-middleware")

router.get("/", CarController.getAll)
router.post("/", roleMiddleware("ADMIN"), CarController.create)
router.get("/:id", CarController.getOne)
router.put("/", roleMiddleware("ADMIN"), CarController.remove)
router.put("/restore", roleMiddleware("ADMIN"), CarController.recover)

module.exports = router
