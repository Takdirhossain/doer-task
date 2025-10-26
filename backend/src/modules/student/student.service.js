const { prisma } = require("../../config/database");
const AppError = require("../../utils/AppError");
const { createLogger } = require("../logManager/log.service");
const { stringify } = require('csv-stringify/sync');
const bcrypt = require("bcryptjs");

exports.filterExistingUsers = async (uniqueUsers, duplicateUsers) => {
  const usernames = uniqueUsers.map((u) => u.username);
  const emails = uniqueUsers.map((u) => u.email);
  const mobiles = uniqueUsers.map((u) => u.mobileNumber);

  const existingUsers = await prisma.user.findMany({
    where: {
      OR: [
        { username: { in: usernames } },
        { email: { in: emails } },
        { mobileNumber: { in: mobiles } },
      ],
    },
  });

  const userMap = new Map();
  existingUsers.forEach((u) => {
    userMap.set(u.username, u);
    userMap.set(u.email, u);
    userMap.set(u.mobileNumber, u);
  });

  const finalUniqueUsers = [];
  const finalDuplicateUsers = [...duplicateUsers];

  for (const user of uniqueUsers) {
    const conflict =
      userMap.get(user.username) ||
      userMap.get(user.email) ||
      userMap.get(user.mobileNumber);
    const conflictInStudentTable = await prisma.student.findFirst({
      where: {
        class: user.class,
        rollNumber: user.rollNumber,
      },
    });
    if (conflict) {
      finalDuplicateUsers.push({
        reason: "Already exists in database",
        conflictField:
          conflict.username === user.username
            ? "username"
            : conflict.email === user.email
              ? "email"
              : "mobileNumber",
        existingId: conflict.id,
        ...user,
      });
    } else if (conflictInStudentTable) {
      finalDuplicateUsers.push({
        reason: "Already exists in database",
        conflictField: "class and roll number",
        existingId: conflictInStudentTable.id,
        ...user,
      });
    } else {
      finalUniqueUsers.push(user);
    }
  }

  return { finalUniqueUsers, finalDuplicateUsers };
};

exports.insertUsers = async (users,teacherId) => {
  const chunkSize = 1000;
  const results = [];

  const role = await prisma.role.findFirst({
    where: { name: 'STUDENT' },
  });
  if (!role) throw new Error('Role STUDENT not found');

  for (let i = 0; i < users.length; i += chunkSize) {
    const chunk = users.slice(i, i + chunkSize);

    const hashedChunk = await Promise.all(
      chunk.map(async (u) => ({
        ...u,
        passwordHash: await bcrypt.hash(u.password_hash || '123456', 10),
      }))
    );

    await prisma.user.createMany({
      data: hashedChunk.map((u) => ({
        username: u.username,
        email: u.email,
        mobileNumber: u.mobileNumber,
        passwordHash: u.passwordHash,
        roleId: role.id, 
      })),
      skipDuplicates: true,
    });

    const emails = hashedChunk.map((u) => u.email);
    const insertedUsers = await prisma.user.findMany({
      where: { email: { in: emails } },
    });

    const studentsData = insertedUsers.map((u) => {
      const userInfo = hashedChunk.find((usr) => usr.email === u.email);
      return {
        userId: u.id,
        rollNumber: userInfo.rollNumber,
        class: userInfo.class,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        dateOfBirth: userInfo.dateOfBirth,
        teacherId:teacherId,
        address:userInfo.address,        
      };
    });

    const insertedStudents = await prisma.student.createMany({
      data: studentsData,
      skipDuplicates: true,
    });

    results.push({
      usersInserted: insertedUsers.length,
      studentsInserted: insertedStudents.count,
    });
  }

  return results;
};

exports.createStudent = async (data, teacherId, username) => {
  const result = await prisma.$transaction(async (prismaTx) => {
    const user = await prismaTx.user.create({
      data: {
        username: data.username,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: "STUDENT",
        passwordHash: await bcrypt.hash(data.password_hash, 10),
      },
    });

    const student = await prismaTx.student.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        class: data.class,
        dateOfBirth: data.dateOfBirth,
        rollNumber: data.rollNumber,
        address: data.address,
        teacherId,
      },
    });

    return { user, student };
  });

  createLogger({
    userId: teacherId,
    userName: username,
    level: "INFO",
    category: "STUDENT",
    action: "CREATE",
    message: "Student created successfully",
    meta: { body: data },
  }).catch((logErr) => {
    console.error("Logging failed:", logErr);
  });

  const { user, student } = result;
  const { passwordHash, ...safeUser } = user;

  return { user: safeUser, student };
};

exports.list = async ({ page = 1, limit = 10, search = "", teacherId }) => {
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      teacherId ? { teacherId } : {},
      search
        ? {
            OR: [
              { user: { username: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
              { user: { mobileNumber: { contains: search, mode: "insensitive" } } }
            ],
          }
        : {},
    ],
  };

  const [total, students] = await Promise.all([
    prisma.student.count({ where }),
    prisma.student.findMany({
      where,
      include: { user: true },
      skip,
      take: Number(limit),
      orderBy: { id: "desc" },
    }),
  ]);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    students,
  };
};

exports.getById = async (id) => {
  const data = await prisma.student.findUnique({
    where: { userId: id },
    include: { user: true },
  });
  return data;
};

exports.update = async (id, data) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new Error("User not found");

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
  });
  if (!student) throw new Error("Student not found");

  const [updatedUser, updatedStudent] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        email: data.email ?? user.email,
        mobileNumber: data.mobileNumber ?? user.mobileNumber,
      },
    }),
    prisma.student.update({
      where: { userId: user.id },
      data: {
        firstName: data.firstName ?? student.firstName,
        lastName: data.lastName ?? student.lastName,
        address: data.address ?? student.address,
      },
    }),
  ]);
  return { user: updatedUser, student: updatedStudent };
};

exports.remove = async (id, userId, username) => {
  const user = await prisma.user.findFirst({
    where: { id: id },
  });
  if (!user) throw new Error("User not found");

  const student = await prisma.student.findFirst({
    where: { userId: id },
  });
  if (!student) throw new Error("Student not found");
  if (student.teacherId !== userId)
    throw new Error("You are not authorized to delete this student");

  await prisma.$transaction([
    prisma.student.delete({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);

  return true;
};

exports.updateStudent = async (data, teacherId, studentId) => {
  const user = await prisma.user.findUnique({
    where: { id: studentId },
  });
  if (!user) throw new AppError("User not found", 404);

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
  });
  if (!student) throw new AppError("Student not found", 404);
  if (student.teacherId !== teacherId)
    throw new AppError("You are not authorized to update this student", 401);

  if (data.class !== undefined && data.rollNumber !== undefined) {
    const existing = await prisma.student.findFirst({
      where: {
        teacherId: teacherId,
        class: data.class,
        rollNumber: data.rollNumber,
        userId: { not: user.id },
      },
    });
    if (existing) {
      throw new AppError(
        `Roll number ${data.rollNumber} is already assigned in class ${data.class}`,
        400
      );
    }
  }

  const [updatedUser, updatedStudent] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        email: data.email ?? user.email,
        mobileNumber: data.mobileNumber ?? user.mobileNumber,
        status: data.status ? "ACTIVE" : "INACTIVE",
      },
    }),
    prisma.student.update({
      where: { userId: user.id },
      data: {
        firstName: data.firstName ?? student.firstName,
        lastName: data.lastName ?? student.lastName,
        address: data.address ?? student.address,
        rollNumber: data.rollNumber ?? student.rollNumber,
        class: data.class ?? student.class,
      },
    }),
  ]);

  return { user: updatedUser, student: updatedStudent };
};

exports.exportStudents = async (teacherId, search = null) => {
  const where = {
    AND: [
      { student: { teacherId } },
      search
        ? {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { mobileNumber: { contains: search, mode: 'insensitive' } },
              { student: { firstName: { contains: search, mode: 'insensitive' } } },
              { student: { lastName: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {},
    ],
  };

  const users = await prisma.user.findMany({
    where,
    include: {
      student: true,
    },
    orderBy: { student: { rollNumber: 'asc' } },
  });

  const records = users.map((u) => ({
    Username: u.username,
    Email: u.email,
    Mobile: u.mobileNumber,
    FirstName: u.student?.firstName || '',
    LastName: u.student?.lastName || '',
    Class: u.student?.class || '',
    RollNumber: u.student?.rollNumber || '',
    DateOfBirth: u.student?.dateOfBirth
      ? u.student.dateOfBirth.toISOString().split('T')[0]
      : '',
    Address: u.student?.address || '',
  }));

  const csvBuffer = Buffer.from(
    stringify(records, { header: true, columns: Object.keys(records[0] || {}) })
  );

  return csvBuffer;
};