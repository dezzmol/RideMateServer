const Router = require("express")
const router = Router()

const userRouter = require("./userRouter")
const cartRouter = require("./carRouter")
const brandRouter = require("./brandRouter")
const classRouter = require("./classRouter")
const historyRouter = require("./historyRouter")
const dataChangeRouter = require("./dataChangeRouter")
const dataRecoveryRouter = require("./dataRecoveryRouter")

router.use("/user", userRouter)
router.use("/cars", cartRouter)
router.use("/brand", brandRouter)
router.use("/class", classRouter)
router.use("/history", historyRouter)
router.use("/change", dataChangeRouter)
router.use("/recover", dataRecoveryRouter)

module.exports = router
