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

    async getAllRentalParkCars(req, res, next) {
        try {
            let { brandId, classId, minPrice, maxPrice, limit, page } =
                req.query
            limit = limit || 10
            page = page || 1
            minPrice = minPrice || 0
            let offset = page * limit - limit

            const cars = await ParkingService.getAllRentalParkCars(
                brandId,
                classId,
                minPrice,
                maxPrice,
                limit,
                page,
                offset
            )

            res.json(cars)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ParkingController()