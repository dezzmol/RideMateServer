const uuid = require("uuid")
const ApiError = require("../exceptions/api-error")
const { CarModel } = require("../models/models")
const {Op} = require("sequelize")

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

    async getAll(brandId, classId, minPrice, maxPrice, limit, page, offset) {
        const whereParam = {}

        if (classId) {
            whereParam.classId = classId;
        }

        if (brandId) {
            whereParam.brandId = brandId;
        }

        if (lowPrice && maxPrice) {
            whereParam.price = {
                [Op.between]: [lowPrice, maxPrice],
            };
        } else if (lowPrice) {
            whereParam.price = {
                [Op.gte]: lowPrice,
            };
        } else if (maxPrice) {
            whereParam.price = {
                [Op.lte]: maxPrice,
            };
        }

        const options = {
            where: whereParam,
            offset: offset,
            limit: parseInt(limit),
        };

        const cars = await CarModel.findAndCountAll(options)

        return cars
    }
}

module.exports = new CarService()