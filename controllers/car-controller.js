const ApiError = require("../exceptions/api-error")
const CarService = require("../services/car-service")

class CarController {
    async getAll(req, res, next) {
        try {
            let {brandId, classId, lowPrice, maxPrice, limit, page} = req.query
            limit = limit || 10
            page = page || 1
            lowPrice = lowPrice || 0;
            let offset = page * limit - limit
            const cars = await CarService.getAll(brandId, classId, lowPrice, maxPrice, limit, page, offset)
            res.json(cars)
        } catch (e) {
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const {model, classId, brandId, mileage, fuelConsumption, price} = req.body
            const {img} = req.files
    
            const car = await CarService.create(model, classId, mileage, fuelConsumption, brandId, img, price)

            return res.json(car)
        } catch (e) {
            next(e)
        }
        
        
    }
}

module.exports = new CarController()