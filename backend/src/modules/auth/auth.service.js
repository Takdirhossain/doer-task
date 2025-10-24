const { prisma } = require("../../config/database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hideFields } = require("../../utils/responseFilter");
const { createLog, createLogger } = require("../logManager/log.service");
const AppError = require("../../utils/AppError");
const { getRequestContext } = require("../../utils/requestContext");

exports.registerUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        mobileNumber: data.mobile,
        passwordHash: hashedPassword,
        role: "TEACHER"
      }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5d' });

    return { user, token };

  } catch (error) {
    if (error.code && error.code.startsWith('P')) {
      throw error; 
    }
    throw new AppError('Something went wrong during registration', 500);
  }
};

  exports.loginUser = async (data, meta) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: data.username
        }
      });
      if (!user) throw new AppError('User not found', 404);
      const { method, path, ipAddress, userAgent } = getRequestContext();
   
      const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
      if (!isPasswordValid) throw new AppError('Invalid password', 401);
      if(user.status === "INACTIVE") throw new AppError('You are inactive', 401);
      
     
      const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '5d' });
      let userData = hideFields(user, ['passwordHash']);
      createLog({ipAddress, userAgent, userId: user.id, actionType: 'login', status: 'success', message: 'User logged in successfully'});
      createLogger({
        method,
        path,
        ipAddress,
        userId: user.id,
        userName: user.username,
        level: 'INFO',
        category: 'login',
        action: 'login',
        ipAddress: meta.ipAddress,
        message: 'User logged in successfully',
        method: meta.method,
        path: meta.path,
        meta: meta
      });

      return { user: userData, token }; 
    } catch (error) {
      throw error;
    }
  };
exports.logoutUser = async (userId, meta) => {
    try {
      createLog({...meta, userId: userId, actionType: 'logout', status: 'success', message: 'User logged out successfully'});
      return true;
    } catch (error) {
      throw error;
    }
  };