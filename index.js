require("dotenv").config()
const express = require("express")
const sequelize = require("./db")
const cors = require("cors")
const router = require("./routes/index")
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middlewares/error-middleware")
require("pg")

const PORT = process.env.PORT || 5000

const app = express()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use("/api", router)
app.use(errorMiddleware)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log("Server started"))
  } catch (e) {
    console.log(e)
  }
}

start()
