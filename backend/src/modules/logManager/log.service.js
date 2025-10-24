const { prisma } = require("../../config/database");

exports.createLog = async (data) => {
    try {
        const log = await prisma.loginLog.create({
            data: {
                userId: data.userId,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                message: data.message,
                actionTime: new Date(),
                actionType: data.actionType,
                status: data.status,
            }
        });
        return log;
    } catch (error) {
        throw error;
    }
}
exports.getLogs = async (req, userId) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.loginLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.loginLog.count({
        where: { userId },
      }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

exports.createLogger = async(data) => {
  
}