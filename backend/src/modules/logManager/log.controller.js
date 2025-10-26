const { prisma } = require("../../config/database");
const apiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");
const logService = require("./log.service");
exports.getLogs = catchAsync(async (req, res) => {
    
        let userId = req.user.id;
        const logs = await logService.getLogs(req, userId);
        res.json(apiResponse(true, 'Logs fetched successfully', logs));
   
});
exports.getLogger =catchAsync(async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const logs = await logService.getLogger(page, limit);
    res.json(apiResponse(true, 'Logs fetched successfully', logs));
});
