const ScheduleServices = require("../Services/schedule-services")

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
            const carId = req.params.id
            const { datesToBook } = req.body
            const schedule = await ScheduleServices.setBookingDates(
                carId,
                datesToBook
            )

            return res.json(schedule)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ScheduleController()
