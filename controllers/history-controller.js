const HistoryService = require("../Services/history-service")

class HistoryController {
    async getAll(req, res, next) {
        try {
            const { id: userId } = req.user
            const history = await HistoryService.getAll(userId)

            return res.json(history)
        } catch (e) {
            next(e)
        }
    }

    async rentCar(req, res, next) {
        try {
            const { carId, startDate, endDate } = req.body
            const { id: userId } = req.user
            //startDate, endDate - timestamp
            const rent = await HistoryService.addToHistory(carId, userId, startDate, endDate)

            return res.json(rent)
        } catch (e) {
            next(e)
        }
    }

    async cancelRental(req, res, next) {
        try {
            const { historyId } = req.body

            await HistoryService.cancelRental(historyId)

            return res.json({ message: "The rental was successfully canceled" })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new HistoryController()
