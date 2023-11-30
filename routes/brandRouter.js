const Router = require("express")
const router = Router()
const BrandController = require("../controllers/brand-controller")
const roleMiddleware = require("../middlewares/role-middleware")

router.get("/", BrandController.getAll)
router.get("/:id", BrandController.getOne)
router.post("/", roleMiddleware("ADMIN"), BrandController.create)

module.exports = router
