const ApiError = require("../exceptions/api-error")
const { ClassModel } = require("../models/models")

class ClassService {
    async create(name) {
        if (!name) {
            throw ApiError.BadRequest("Name field is empty")
        }

        const isExist = await ClassModel.findOne({ where: { name } })

        if (isExist) {
            throw ApiError.BadRequest("This class already exist")
        }

        const carClass = await ClassModel.create({ name: name })

        return carClass
    }

    async getAll() {
        const carClasses = await ClassModel.findAndCountAll()

        if (!carClasses) {
            throw ApiError.BadRequest("There are no car classes")
        }

        return carClasses
    }

    async getOne(classId) {
        if (!classId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const carClass = await ClassModel.findOne({ where: { id: classId } })

        if (!carClass) {
            throw ApiError.BadRequest("Class with this id doesn't exist")
        }

        return carClass
    }

    async delete(classId) {
        if (!classId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const deletedClass = await ClassModel.destroy({
            where: { id: classId },
        })

        if (deletedClass === 0) {
            throw ApiError.BadRequest(`Class with ID ${classId} does not exist`)
        }
    }
}

module.exports = new ClassService()
