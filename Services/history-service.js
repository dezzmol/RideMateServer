const { UserHistoryModel, CarModel, BrandModel } = require("../models/models")
const ApiError = require("../exceptions/api-error")

const isBusyDates = (firstDates, secondDates) => {
    return !(firstDates[1] < secondDates[0] || secondDates[1] < firstDates[0]);
}


class HistoryService {
    async getAll(userId) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }

        const history = await UserHistoryModel.findAndCountAll({
            where: { userId },
            attributes: ["id", "carId", "occupied_dates", "totalPrice"],
        })
        const cars = await CarModel.findAll({
            attributes: ["id", "img", "model", "brandId"],
        })
        const brands = await BrandModel.findAll({
            attributes: ["id", "name"],
        })

        return { history, cars, brands }
    }

    async addToHistory(carId, userId, startDate, endDate) {
        if (!carId) {
            throw ApiError.BadRequest("carId field is empty")
        }
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!startDate || !endDate) {
            throw ApiError.BadRequest("No dates specified")
        }

        const startDateTimestamp = Date.parse(startDate.toString())
        const endDateTimestamp = Date.parse(endDate.toString())

        if (startDateTimestamp > endDateTimestamp) {
            throw ApiError.BadRequest("Start date can't be bigger than end date")
        }

        const existingRentals = await UserHistoryModel.findAll({
            where: {
                carId: carId
            },
        });


        if (existingRentals.length > 0) {
            existingRentals.map(existingRental => {
                const existingRentalDates = existingRental.getDataValue("occupied_dates")
                const existingRentalStartDate = new Date(existingRentalDates[0])
                const existingRentalEndDate = new Date(existingRentalDates[1])
                if (isBusyDates([new Date(startDateTimestamp), new Date(endDateTimestamp)], [existingRentalStartDate, existingRentalEndDate])) {
                    throw ApiError.BadRequest("Dates are busy")
                }
            })
        }

        const car = await CarModel.findOne({ where: { id: carId } })

        const daysDiff = Math.ceil((new Date(endDateTimestamp) - new Date(startDateTimestamp)) / (1000 * 60 * 60 * 24));

        const totalPrice = car.price * daysDiff;

        const userHistory = await UserHistoryModel.create({
            carId,
            userId,
            occupied_dates: [new Date(startDateTimestamp), new Date(endDateTimestamp)],
            totalPrice,
        })

        return userHistory
    }

    async cancelRental(historyId) {
        if (!historyId) {
            throw ApiError.BadRequest("historyId field is empty")
        }

        const history = await UserHistoryModel.destroy({
            where: { id: historyId },
        })

        return history
    }
}

module.exports = new HistoryService()
