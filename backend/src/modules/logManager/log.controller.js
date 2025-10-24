const { prisma } = require("../../config/database");
const apiResponse = require("../../utils/apiResponse");
const logService = require("./log.service");
exports.getLogs = async (req, res) => {
    try {
        let userId = req.user.id;
        const logs = await logService.getLogs(req, userId);
        res.json(apiResponse(true, 'Logs fetched successfully', logs));
    } catch (error) {
        res.status(400).json(apiResponse(false, error.message));
    }
};