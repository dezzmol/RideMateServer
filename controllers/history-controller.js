const HistoryService = require("../Services/history-service")
const ScheduleService = require("../Services/schedule-services")

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

    async cancelRental(req, res, next) {
        try {
            const { carId, historyId, datesToRemove } = req.body

            await HistoryService.cancelRental(historyId)
            await ScheduleService.deleteBookingDates(carId, datesToRemove)

            return res.json({ message: "The rental was successfully canceled" })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new HistoryController()
