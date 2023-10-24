const HistoryService = require("../Services/history-service")

class HistoryController {
    async getAll(req, res, next) {
        try {
            const userId = req.params.userId
            const history = await HistoryService.getAll(userId)

            return res.json(history)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new HistoryController()
