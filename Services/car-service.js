const uuid = require("uuid")
const ApiError = require("../exceptions/api-error")
const path = require("path")
const { CarModel, UserHistoryModel } = require("../models/models")
const { Op } = require("sequelize")

const isBusyDates = (firstDates, secondDates) => {
    return !(firstDates[1] < secondDates[0] || secondDates[1] < firstDates[0])
}

function sortByField(arr, sort, sortBy) {
    const compareFunction = (a, b) => {
        const valueA = typeof a[sort] === 'string' ? a[sort] : String(a[sort]);
        const valueB = typeof b[sort] === 'string' ? b[sort] : String(b[sort]);

        if (sortBy === 'asc') {
            return valueA.localeCompare(valueB, undefined, { numeric: true });
        } else if (sortBy === 'desc') {
            return valueB.localeCompare(valueA, undefined, { numeric: true });
        }

        return 0;
    };

    return arr.slice().sort(compareFunction)
}

class CarService {
    async create(
        model,
        classId,
        mileage,
        fuelConsumption,
        brandId,
        img,
        price
    ) {
        try {
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, "..", "static", fileName))
            const car = await CarModel.create({
                model,
                classId,
                mileage,
                fuelConsumption,
                brandId,
                img: fileName,
                price,
            })

            return car
        } catch (e) {
            throw ApiError.BadRequest("Car creating error " + e)
        }
    }

    async getAll(
        brandId,
        classId,
        minPrice,
        maxPrice,
        startDate,
        endDate,
        limit,
        page,
        offset,
        sort,
        sortBy
    ) {
        const whereParam = {}

        const options = {
            where: whereParam,
            offset: offset,
            limit: parseInt(limit),
            page: page,
        }

        if (classId) {
            whereParam.classId = classId
        }

        if (brandId) {
            whereParam.brandId = brandId
        }

        if (minPrice && maxPrice) {
            whereParam.price = {
                [Op.between]: [minPrice, maxPrice],
            }
        } else if (minPrice) {
            whereParam.price = {
                [Op.gte]: minPrice,
            }
        } else if (maxPrice) {
            whereParam.price = {
                [Op.lte]: maxPrice,
            }
        }

        let cars = await CarModel.findAll(options)

        if (startDate && endDate) {
            const rentalCars = await UserHistoryModel.findAll()
            const startDateTimestamp = Date.parse(startDate.toString())
            const endDateTimestamp = Date.parse(endDate.toString())
            rentalCars.map((rentalCar) => {
                if (cars.find((car) => car.id === rentalCar.carId)) {
                    const rentalCarDates =
                        rentalCar.getDataValue("occupied_dates")
                    const rentalCarStartDate = new Date(rentalCarDates[0])
                    const rentalCarEndDate = new Date(rentalCarDates[1])
                    if (
                        isBusyDates(
                            [
                                new Date(startDateTimestamp),
                                new Date(endDateTimestamp),
                            ],
                            [rentalCarStartDate, rentalCarEndDate]
                        )
                    ) {
                        cars = cars.filter((car) => car.id !== rentalCar.carId)
                    }
                }
            })
        }

        if (sort && sortBy) {
            cars = sortByField(cars, sort, sortBy)
        }

        return { rows: cars, count: cars.length }
    }

    async getOne(carId) {
        if (!carId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const car = await CarModel.findOne({ where: { id: carId } })

        if (!car) {
            throw ApiError.BadRequest("Car with this id doesn't exist")
        }

        return car
    }

    async remove(carId) {
        if (!carId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const car = await CarModel.findOne({ where: { id: carId } })
        car.isActive = false
        car.save()
    }

    async recover(carId) {
        if (!carId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const car = await CarModel.findOne({ where: { id: carId } })

        if (!car.isActive) {
            car.isActive = true
            car.save()
        } else {
            throw ApiError.BadRequest("The car is already on the public list")
        }
    }
}

module.exports = new CarService()