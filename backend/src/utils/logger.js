const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function log({ level = 'info', message, route = null, method = null, userId = null }) {
  try {
    await prisma.log.create({
      data: {
        level,
        message,
        route,
        method,
        userId,
      },
    });
    console.log(`[${level.toUpperCase()}] ${message}`); 
  } catch (error) {
    console.error('Failed to log to DB:', error);
  }
}

module.exports = log;
