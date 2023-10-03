const uuid = require("uuid")
const ApiError = require("../exceptions/api-error")
const { CarModel } = require("../models/models")

class CarService {
    async create(model, classId, mileage, fuelConsumption, brandId, img, price) {
        try {
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, "..", "static", fileName))
            const car = await CarModel.create({model, classId, mileage, fuelConsumption, brandId, img: fileName, price})
            return car;
        } catch (e) {
            throw ApiError.BadRequest("Car creating error")
        }
        
    }
}

module.exports = new CarService()