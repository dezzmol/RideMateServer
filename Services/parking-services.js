const {
    RentalParkingModel,
    MaintenanceParkingModel,
    CarModel,
} = require("../models/models")
const ApiError = require("../exceptions/api-error")

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
}

module.exports = new ParkingServices()
