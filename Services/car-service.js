const uuid = require("uuid")
const ApiError = require("../exceptions/api-error")
const path = require("path")
const { CarModel, CarScheduleModel } = require("../models/models")
const { Op } = require("sequelize")
const ParkingServices = require("./parking-services")
const ScheduleServices = require("./schedule-services")

class CarService {
    async create(
        model,
        classId,
        mileage,
        fuelConsumption,
        brandId,
        img,
        price
    ) {
        try {
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, "..", "static", fileName))
            const car = await CarModel.create({
                model,
                classId,
                mileage,
                fuelConsumption,
                brandId,
                img: fileName,
                price,
            })

            await ParkingServices.addToRentalParking(car.id)
            await ScheduleServices.createSchedule(car.id)

            return car
        } catch (e) {
            throw ApiError.BadRequest("Car creating error " + e)
        }
    }

    async getAll(brandId, classId, minPrice, maxPrice, limit, page, offset) {
        const whereParam = {}

        if (classId) {
            whereParam.classId = classId
        }

        if (brandId) {
            whereParam.brandId = brandId
        }

        if (minPrice && maxPrice) {
            whereParam.price = {
                [Op.between]: [minPrice, maxPrice],
            }
        } else if (minPrice) {
            whereParam.price = {
                [Op.gte]: minPrice,
            }
        } else if (maxPrice) {
            whereParam.price = {
                [Op.lte]: maxPrice,
            }
        }

        const options = {
            where: whereParam,
            offset: offset,
            limit: parseInt(limit),
            page: page,
        }

        const cars = await CarModel.findAndCountAll(options)

        return cars
    }

    async getOne(carId) {
        if (!carId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const car = await CarModel.findOne({ where: { id: carId } })

        if (!car) {
            throw ApiError.BadRequest("Car with this id doesn't exist")
        }

        return car
    }
}

module.exports = new CarService()
