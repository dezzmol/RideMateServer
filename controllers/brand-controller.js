const BrandServices = require("../services/brand-services")

class BrandController {
    async create(req, res, next) {
        try {
            const name = req.body.name
            const brand = await BrandServices.create(name)

            res.json(brand)
        } catch (e) {
            next(e)
        }
    }

    async getAll(req, res, next) {
        try {
            const brands = await BrandServices.getAll()
            res.json(brands)
        } catch (e) {
            next(e)
        }
    }

    async getOne(req, res, next) {
        try {
            const brandId = req.params.id
            const brand = await BrandServices.getOne(brandId)

            res.json(brand)
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { brandId } = req.body

            const deletionRes = await BrandServices.delete(brandId)

            if (deletionRes === 1) {
                return res.json(
                    `The brand with ID ${brandId} was deleted successfully`
                )
            }

            return res.json("Something went wrong")
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new BrandController()
