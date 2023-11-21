const ClassService = require("../services/class-service")

class ClassController {
    async create(req, res, next) {
        try {
            const name = req.body.name

            const carClass = await ClassService.create(name)

            return res.json(carClass)
        } catch (e) {
            next(e)
        }
    }

    async getAll(req, res, next) {
        try {
            const carClasses = await ClassService.getAll()

            res.json(carClasses)
        } catch (e) {
            next(e)
        }
    }

    async getOne(req, res, next) {
        try {
            const classId = req.params.id

            const carClass = await ClassService.getOne(classId)

            res.json(carClass)
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { classId } = req.body

            const deletionRes = await ClassService.delete(classId)

            if (deletionRes === 1) {
                return res.json(
                    `The class with ID ${classId} was deleted successfully`
                )
            }

            return res.json("Something went wrong")
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ClassController()
