const uuid = require("uuid")
const ApiError = require("../exceptions/api-error")
const { CarModel, CarScheduleModel} = require("../models/models")
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

        if (minPrice && maxPrice) {
            whereParam.price = {
                [Op.between]: [minPrice, maxPrice],
            };
        } else if (minPrice) {
            whereParam.price = {
                [Op.gte]: minPrice,
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

    async getSchedule(carId) {
        if (!carId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const schedule = CarScheduleModel.findOne({where: {carId: carId}})

        if (!schedule) {
            throw ApiError.BadRequest("ScheduleDoesNotExist")
        }

        return schedule
    }
}

module.exports = new CarService()