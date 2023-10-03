const Router = require('express')
const router = Router()

const userRouter = require('./userRouter')
const cartRouter = require("./carRouter")

router.use("/user", userRouter)
router.use("/cars", cartRouter)

module.exports = router