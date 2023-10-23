const { UserHistoryModel, CarModel } = require("../models/models")

class HistoryService {
    async getAll() {}

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
}

module.exports = new HistoryService()
