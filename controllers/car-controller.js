const CarService = require("../services/car-service")

class CarController {
    async getAll(req, res, next) {
        try {
            let {
                brandId,
                classId,
                minPrice,
                maxPrice,
                startDate,
                endDate,
                limit,
                page,
                sort,
                sortBy
            } = req.query
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
                offset,
                sort,
                sortBy
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

    async remove(req, res, next) {
        try {
            const { carId } = req.body

            await CarService.remove(carId)

            return res.json({
                message: `The car with ID ${carId} was removed from public list successfully`,
            })
        } catch (e) {
            next(e)
        }
    }

    async recover(req, res, next) {
        try {
            const { carId } = req.body

            await CarService.recover(carId)

            return res.json({
                message: `The car with ID ${carId} has been successfully restored to the public list`,
            })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CarController()
