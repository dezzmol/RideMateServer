const Router = require('express')
const router = Router()

const userRouter = require('./userRouter')
const cartRouter = require("./carRouter")
const brandRouter = require("./brandRouter")
const classRouter = require("./classRouter")
const parkingRouter = require("./parkingRouter")

router.use("/user", userRouter)
router.use("/cars", cartRouter)
router.use("/brand", brandRouter)
router.use("/class", classRouter)
router.use("/parking", parkingRouter)

module.exports = router