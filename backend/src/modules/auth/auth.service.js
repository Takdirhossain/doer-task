const { prisma } = require("../../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { hideFields } = require("../../utils/responseFilter");
const { createLog, createLogger } = require("../logManager/log.service");
const AppError = require("../../utils/AppError");

exports.registerUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const role = await prisma.role.findUnique({
    where: {
      id: data?.role,
    },
  });

  if (!role) throw new AppError("Role not found", 404);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      mobileNumber: data.mobile,
      passwordHash: hashedPassword,
      roleId: data?.role,
    },
  });

  const token = jwt.sign(
    { id: user.id, role: role?.id, roleName: role?.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "5d",
    }
  );

  const { passwordHash, ...rest } = user;

  const sanitizedUser = {
    ...rest,
    role: role?.name || null,
  };
  createLogger({
    userId: user.id,
    userName: user?.username,
    level: "INFO",
    category: "register",
    action: "register",
    message: "User registered successfully",
    meta: sanitizedUser,
  });

  return { user: sanitizedUser, token };
};

exports.loginUser = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });
  if (!user) throw new AppError("User not found", 404);
  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );
  if (!isPasswordValid) throw new AppError("Invalid password", 401);
  if (user.status === "INACTIVE") throw new AppError("You are inactive", 401);
  const role = await prisma.role.findUnique({
    where: {
      id: user.roleId,
    },
  });

  const token = jwt.sign(
    { id: user.id, role: role?.id, roleName: role?.name },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );
  const{passwordHash,...rest} = user;
  const userData = {
    ...rest,
    role: role?.name || null,
  };
  createLog({
    userId: user.id,
    actionType: "login",
    status: "success",
    message: "User logged in successfully",
  });
  createLogger({
    userId: user.id,
    userName: user?.username,
    level: "INFO",
    category: "login",
    action: "login",
    message: "User logged in successfully",
    meta: userData,
  });

  return { user: userData, token };
};
exports.logoutUser = async (userId) => {
  createLog({
    userId: userId,
    actionType: "logout",
    status: "success",
    message: "User logged out successfully",
  });
  return true;
};
