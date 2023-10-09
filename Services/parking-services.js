const {RentalParkingModel, MaintenanceParkingModel } = require("../models/models")
const ApiError = require("../exceptions/api-error")

class ParkingServices {
    async moveToMaintenanceParking(carId) {
        if (!carId) {
            throw ApiError.BadRequest("CarIdDoesNotExist")
        }

        const carOnRentalPark = await RentalParkingModel.findOne({where: {carId: carId}})

        if (!carOnRentalPark) {
            throw ApiError.BadRequest("CarDoesNotExistOnRentalPark")
        }

        const car = await MaintenanceParkingModel.create({carId: carOnRentalPark.carId})
        await RentalParkingModel.destroy({where: {id: carOnRentalPark.id}})

        return car
    }

    async moveToRentalParking(carId) {
        if (!carId) {
            throw ApiError.BadRequest("CarIdDoesNotExist")
        }

        const carOnRentalPark = await MaintenanceParkingModel.findOne({where: {carId: carId}})

        if (!carOnRentalPark) {
            throw ApiError.BadRequest("CarDoesNotExistOnRentalPark")
        }

        const car = await RentalParkingModel.create({carId: carOnRentalPark.carId})
        await MaintenanceParkingModel.destroy({where: {id: carOnRentalPark.id}})

        return car
    }
}

module.exports = new ParkingServices()