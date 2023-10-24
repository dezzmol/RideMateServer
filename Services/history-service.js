const { UserHistoryModel, CarModel } = require("../models/models")
const ApiError = require("../exceptions/api-error")

class HistoryService {
    async getAll(userId) {
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }

        const history = await UserHistoryModel.findAndCountAll({
            where: { userId },
        })

        return history
    }

    async addToHistory(carId, userId, datesToBook) {
        if (!carId) {
            throw ApiError.BadRequest("carId field is empty")
        }
        if (!userId) {
            throw ApiError.BadRequest("userId field is empty")
        }
        if (!datesToBook) {
            throw ApiError.BadRequest("No dates specified")
        }

        const car = await CarModel.findOne({ where: { id: carId } })
        const totalPrice = car.price * datesToBook.length

        const userHistory = await UserHistoryModel.create({
            carId,
            userId,
            occupied_dates: datesToBook,
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
