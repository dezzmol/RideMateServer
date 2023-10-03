
const ApiError = require("../exceptions/api-error")
const CarService = require("../services/car-service")

class CarController {
    async getAll(req, res, next) {

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