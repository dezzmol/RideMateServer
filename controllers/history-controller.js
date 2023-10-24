const HistoryService = require("../Services/history-service")
const ScheduleService = require("../Services/schedule-services")

class HistoryController {

    async getAll(req, res, next) {
        try {
            const userId = req.params.userId
            const history = await HistoryService.getAll(userId)

    async cancelRental(req, res, next) {
        try {
            const { carId, historyId, datesToRemove } = req.body

            const history = await HistoryService.cancelRental(historyId)
            await ScheduleService.deleteBookingDates(carId, datesToRemove)


            return res.json(history)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new HistoryController()
