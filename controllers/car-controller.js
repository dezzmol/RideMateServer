const CarService = require("../services/car-service")

class CarController {
    async getAll(req, res, next) {
        try {
            let { brandId, classId, minPrice, maxPrice, startDate, endDate, limit, page } =
                req.query
            limit = limit || 10
            page = page || 1
            minPrice = minPrice || 0
            let offset = page * limit - limit
            const cars = await CarService.getAll(
                brandId,
                classId,
                minPrice,
                maxPrice,
                startDate,
                endDate,
                limit,
                page,
                offset
            )
            res.json(cars)
        } catch (e) {
            next(e)
        }
    }

    async getOne(req, res, next) {
        try {
            const carId = req.params.id

            const car = await CarService.getOne(carId)

            res.json(car)
        } catch (e) {
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const { model, classId, brandId, mileage, fuelConsumption, price } =
                req.body
            const { img } = req.files

            const car = await CarService.create(
                model,
                classId,
                mileage,
                fuelConsumption,
                brandId,
                img,
                price
            )

            return res.json(car)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CarController()
