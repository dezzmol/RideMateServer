const {
    RentalParkingModel,
    MaintenanceParkingModel, 
    CarModel,
} = require("../models/models")
const ApiError = require("../exceptions/api-error")
const {Op} = require("sequelize");

class ParkingServices {
    async moveToMaintenanceParking(carId) {
        if (!carId) {
            throw ApiError.BadRequest("CarIdDoesNotExist")
        }

        const carOnRentalPark = await RentalParkingModel.findOne({
            where: { carId: carId },
        })

        if (!carOnRentalPark) {
            throw ApiError.BadRequest("CarDoesNotExistOnRentalPark")
        }

        const car = await MaintenanceParkingModel.create({
            carId: carOnRentalPark.carId,
        })
        await RentalParkingModel.destroy({ where: { id: carOnRentalPark.id } })

        return car
    }

    async moveToRentalParking(carId) {
        if (!carId) {
            throw ApiError.BadRequest("CarIdDoesNotExist")
        }

        const carOnMaintenancePark = await MaintenanceParkingModel.findOne({
            where: { carId: carId },
        })

        if (!carOnMaintenancePark) {
            throw ApiError.BadRequest("CarDoesNotExistOnRentalPark")
        }

        const car = await RentalParkingModel.create({
            carId: carOnMaintenancePark.carId,
        })
        await MaintenanceParkingModel.destroy({
            where: { id: carOnMaintenancePark.id },
        })

        return car
    }

    async addToRentalParking(carId) {
        if (!carId) {
            throw ApiError.BadRequest("CarIdDoesNotExist")
        }

        const rentalCar = await RentalParkingModel.create({ carId: carId })
        const car = await CarModel.findOne({ where: { id: carId } })
        car.rentalParkingId = rentalCar.id
        car.save()
    }

    async getAllRentalParkCars(brandId, classId, minPrice, maxPrice, limit, page, offset) {
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
            page: page
        }

        const cars = await CarModel.findAndCountAll({...options, where: { rentalParkingId: { [Op.gte]: 0}}, ...options.where})

        // cars.count = cars.row.length
        return cars
    }
}

module.exports = new ParkingServices()