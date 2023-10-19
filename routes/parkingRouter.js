const Router = require("express")
const router = Router()
const ParkingController = require("../controllers/parking-controller")

router.post("/toRental", ParkingController.moveToRentalParking)
router.post("/toMaintenance", ParkingController.moveToMaintenanceParking)
router.get("/rentalCars", ParkingController.getAllRentalParkCars)

module.exports = router