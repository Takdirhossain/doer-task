const { prisma } = require("../../config/database");
const AppError = require("../../utils/AppError");
const { createLogger } = require("../logManager/log.service");
const { studentSchema } = require("./student.validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let uniqueUsers = [];
let duplicateUsers = [];

exports.importFromCsv = async (rows) => {
  uniqueUsers = [];
  duplicateUsers = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const data = {
      username: row.user_name.trim(),
      email: row.email.trim(),
      mobileNumber: row.mobile_number.trim(),
      firstName: row.first_name?.trim() || null,
      lastName: row.last_name?.trim() || null,
      className: row.class?.trim() || null,
      dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth) : null,
      rollNumber: row.roll_number ? Number(row.roll_number) : null,
      password_hash: row.password_hash?.trim() || "123456",
      address: row.address?.trim() || null,
    };

    const { error } = studentSchema.validate(data);
    if (error) {
      duplicateUsers.push({
        reason: error.details.map((d) => d.message).join(", "),
        rowNumber: index + 2,
        ...data,
      });
      continue;
    }

    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email },
          { mobileNumber: data.mobileNumber },
        ],
      },
    });

    if (exists) {
      duplicateUsers.push({
        reason: "Already exists in database",
        rowNumber: index + 2,
        conflictField:
          exists.username === data.username
            ? "username"
            : exists.email === data.email
              ? "email"
              : "mobileNumber",
        existingId: exists.id,
        ...data,
      });
    } else {
      uniqueUsers.push(data);
    }
  }

  return {
    uniqueCount: uniqueUsers.length,
    duplicateCount: duplicateUsers.length,
    uniqueUsers,
    duplicateUsers,
  };
};
exports.create = async (req) => {
  const teacherId = req.user.id;
  if (uniqueUsers.length === 0) throw new Error("No unique users found");

  const usersData = uniqueUsers.map((u) => ({
    username: u.username,
    email: u.email,
    mobileNumber: u.mobileNumber,
    role: "STUDENT",
    passwordHash: bcrypt.hashSync(u.password_hash, 10),
  }));

  await prisma.$transaction(async (prismaTx) => {
    const createdUsers = await prismaTx.user.createMany({
      data: usersData,
      skipDuplicates: true,
    });

    const insertedUsers = await prismaTx.user.findMany({
      where: {
        email: { in: uniqueUsers.map((u) => u.email) },
      },
    });

    const studentsData = uniqueUsers.map((u) => {
      const user = insertedUsers.find((user) => user.email === u.email);
      return {
        userId: user.id,
        firstName: u.firstName,
        lastName: u.lastName,
        class: u.className,
        dateOfBirth: u.dateOfBirth,
        rollNumber: u.rollNumber,
        address: u.address,
        teacherId: teacherId,
      };
    });

    await prismaTx.student.createMany({
      data: studentsData,
      skipDuplicates: true,
    });
  });

  return uniqueUsers;
};
exports.createStudent = async(data, teacherId, username) => {
 try {
   const createStudent =  await prisma.$transaction(async (prismaTx) => {
    const user = await prismaTx.user.create({
      data: {
        username: data.username,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: "STUDENT",
        passwordHash: bcrypt.hashSync(data.password_hash, 10),
      },
    })
    const student = await prismaTx.student.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        class: data.class,
        dateOfBirth: data.dateOfBirth,
        rollNumber: data.rollNumber,
        address: data.address,
        teacherId: teacherId,
      },
    })

    try {
      await createLogger({
        userId: teacherId,
        userName: username,
        level: 'INFO',
        category: 'Add Student',
        action: 'Add Student',
        message: 'Student created successfully',
        meta: { body: data }
      });
    } catch (logErr) {
      console.log(logErr)
      throw new AppError('Something went wrong during student creation', 500);
    }

    return {user, student};
  });
 } catch (error) {
  if (error.code && error.code.startsWith('P')) {
    throw error; 
  }
  console.log(error)
  throw new AppError(error.message, 500);
 }
}
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
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
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
  console.log(id, userId, username);
  const user = await prisma.user.findFirst({
    where: { id: id },
  });
  if (!user) throw new Error("User not found");

  const student = await prisma.student.findFirst({
    where: { userId: id },
  });
  if (!student) throw new Error("Student not found");
  if (student.teacherId !== userId) throw new Error("You are not authorized to delete this student");

  await prisma.$transaction([
    prisma.student.delete({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);

  try {
    await createLogger({
      userId: userId,
      userName: username,
      level: 'INFO',
      category: 'Delete Student',
      action: 'Delete Student',
      message: 'Student deleted successfully',
      meta: { body: { id } }
    });
  } catch (logErr) {
    console.log(logErr)
    throw new AppError('Something went wrong during student deletion', 500);
  }

  return true;
};

exports.updateStudent = async (data, teacherId, studentId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!user) throw new AppError("User not found", 404);

    const student = await prisma.student.findUnique({
      where: { userId: user.id },
    });
    if (!student) throw new AppError("Student not found", 404);
    if (student.teacherId !== teacherId) throw new AppError("You are not authorized to update this student", 401);

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
  } catch (error) {
    if (error.code && error.code.startsWith("P")) throw error;
    throw new AppError(error.message, 500);
  }
};
