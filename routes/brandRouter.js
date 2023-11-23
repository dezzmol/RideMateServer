const Router = require("express")
const router = Router()
const BrandController = require("../controllers/brand-controller")

router.get("/", BrandController.getAll)
router.get("/:id", BrandController.getOne)
router.post("/", BrandController.create)

module.exports = router
