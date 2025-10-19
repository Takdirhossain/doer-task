const { prisma } = require("../../config/database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hideFields } = require("../../utils/responseFilter");
const { createLog } = require("../logs/log.service");

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
      if (error.code === 'P2002') { 
        const field = error.meta.target[0]; 
        throw new Error(`${field} already exists`);
      }
      throw error;
    }
  };

  exports.loginUser = async (data, meta) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: data.username
        }
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      if(user.status === "INACTIVE") {
        throw new Error('You are inactive');
      }
     
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5d' });
      let userData = hideFields(user, ['passwordHash']);
      createLog({...meta, userId: user.id, actionType: 'login', status: 'success', message: 'User logged in successfully'});

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