const { CarModel, CarScheduleModel } = require("../models/models")
const ApiError = require("../exceptions/api-error")
const { where } = require("sequelize")

class ScheduleServices {
    async getSchedule(carId) {
        if (!carId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const schedule = CarScheduleModel.findOne({ where: { carId: carId } })

        if (!schedule) {
            throw ApiError.BadRequest("ScheduleDoesNotExist")
        }

        return schedule
    }

    async createSchedule(carId) {
        if (!carId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const occupied_dates = []
        const schedule = await CarScheduleModel.create({
            carId,
            occupied_dates,
        })

        const car = await CarModel.findOne({ where: { id: carId } })
        car.carScheduleId = schedule.id
        car.save()
    }

    async setBookingDates(carId, datesToBook) {
        if (!carId) {
            throw ApiError.BadRequest("Id field is empty")
        }
        if (!datesToBook) {
            throw ApiError.BadRequest("No dates specified")
        }

        const schedule = await CarScheduleModel.findOne({ where: { carId } })
        const isDatesBusy = schedule.occupied_dates.some(
            (date) => datesToBook.indexOf(date) >= 0
        )
        if (isDatesBusy) {
            throw ApiError.BadRequest("Date(s) is/are already booked")
        }

        schedule.occupied_dates = [...schedule.occupied_dates, ...datesToBook]
        schedule.save()

        return schedule
    }
}

module.exports = new ScheduleServices()
