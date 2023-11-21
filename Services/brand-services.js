const { BrandModel } = require("../models/models")
const ApiError = require("../exceptions/api-error")

class BrandServices {
    async create(name) {
        if (!name) {
            throw ApiError.BadRequest("Name field is empty")
        }

        const isExist = await BrandModel.findOne({ where: { name: name } })

        if (isExist) {
            throw ApiError.BadRequest("Brand with this name already exist")
        }

        const brand = await BrandModel.create({ name: name })

        return brand
    }

    async getAll() {
        const brands = await BrandModel.findAndCountAll()

        if (!brands) {
            throw ApiError.BadRequest("There are no brands")
        }

        return brands
    }

    async getOne(brandId) {
        if (!brandId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const brand = await BrandModel.findOne({ where: { id: brandId } })

        if (!brand) {
            throw ApiError.BadRequest("Brand with this id doesn't exist")
        }

        return brand
    }

    async delete(brandId) {
        if (!brandId) {
            throw ApiError.BadRequest("Id field is empty")
        }

        const deletedBrand = await BrandModel.destroy({
            where: { id: brandId },
        })

        return deletedBrand
    }
}

module.exports = new BrandServices()
