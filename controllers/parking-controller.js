const ParkingService = require("../services/parking-services")

class ParkingController {
    async moveToMaintenanceParking(req, res, next) {
        try {
            const carId = req.body.id
            const car = await ParkingService.moveToMaintenanceParking(carId)

            res.json(car)
        } catch (e) {
            next(e)
        }
    }

    async moveToRentalParking(req, res, next) {
        try {
            const carId = req.body.id
            const car = await ParkingService.moveToRentalParking(carId)

            res.json(car)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ParkingController()