const Router = require("express")
const router = Router()
const ClassController = require("../controllers/class-controller")
const roleMiddleware = require("../middlewares/role-middleware")

router.get("/", ClassController.getAll)
router.get("/:id", ClassController.getOne)
router.post("/", roleMiddleware("ADMIN"), ClassController.create)

module.exports = router
