const ScheduleServices = require("../Services/schedule-services")
const HistoryService = require("../Services/history-service")

class ScheduleController {
    async getSchedule(req, res, next) {
        try {
            const carId = req.params.id
            const schedule = await ScheduleServices.getSchedule(carId)

            return res.json(schedule)
        } catch (e) {
            next(e)
        }
    }

    async setBookingDates(req, res, next) {
        try {
            const { carId, userId, datesToBook } = req.body
            const schedule = await ScheduleServices.setBookingDates(
                carId,
                datesToBook
            )
            await HistoryService.addToHistory(carId, userId, datesToBook)

            return res.json(schedule)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ScheduleController()
