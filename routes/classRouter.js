const Router = require("express")
const router = Router()
const ClassController = require("../controllers/class-controller")

router.get("/", ClassController.getAll)
router.get("/:id", ClassController.getOne)
router.post("/", ClassController.create)

module.exports = router