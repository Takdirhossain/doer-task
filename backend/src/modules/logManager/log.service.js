const { prisma } = require("../../config/database");
const { getRequestContext } = require("../../utils/requestContext");

exports.createLog = async (data) => {
    try {
        const { ipAddress, userAgent } = getRequestContext();
        const log = await prisma.loginLog.create({
            data: {
                userId: data?.userId,
                ipAddress: ipAddress,
                userAgent: userAgent,
                message: data?.message,
                actionTime: new Date(),
                actionType: data?.actionType,
                status: data.status,
            }
        });
        return log;
    } catch (error) {
      console.error("⚠️ Log creation failed:", error.message);
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
exports.getLogger= async(req, page, limit) => {
  
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.log.count({
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
  
}

exports.createLogger = async(data) => {
  try {
    const { method, path, ipAddress } = getRequestContext();
    const log = await prisma.log.create({
      data: {
        userId:data?.userId,
        userName:data?.userName,
        level:data?.level,
        category:data?.category,
        action:data?.action,
        ipAddress:ipAddress,
        message:data?.message,
        method:method,
        path:path,
        meta:data?.meta,
      }
    });
    return log;
  } catch (error) {
    console.error("⚠️ Log creation failed:", error.message);
  }
}