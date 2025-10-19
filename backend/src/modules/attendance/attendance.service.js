const { prisma } = require("../../config/database");
const { getTodayRange } = require("../../utils/date");
const { startOfYear, endOfYear, eachDayOfInterval, getDay, isBefore, max } = require("date-fns");

exports.present = async (studentId) => {
  const { start, end } = getTodayRange();
  
  const student = await prisma.student.findUnique({
    where: {
      userId: studentId,
    },
  });


  if (!student) {
    throw new Error("Student not found");
  }

  const checkPresent = await prisma.attendance.findFirst({
    where: {
      studentId: studentId,
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  if (checkPresent) {
    throw new Error("Attendance already marked");
  }

  const present = await prisma.attendance.create({
    data: {
     studentId: studentId,  
    teacherId: student.teacherId,
    status: "PRESENT",
    date: new Date(),
    markedBy: studentId,
    },
  });

  return present;
};


exports.getTodayAttendance = async (teacherId, page = 1, limit = 10, filter = "all") => {
  const { start, end } = getTodayRange();
  const validFilters = ["all", "present", "absent", "late"];

  if (!validFilters.includes(filter.toLowerCase())) {
    throw new Error(`Invalid filter. Use one of: ${validFilters.join(", ")}`);
  }

  try {    
    const students = await prisma.student.findMany({
      where: { 
        teacherId: teacherId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userId: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (students.length === 0) {
      return {
        success: true,
        filter,
        totalStudents: 0,
        total: 0,
        page,
        limit,
        totalPages: 0,
        stats: {
          present: 0,
          absent: 0,
          late: 0,
        },
        data: [],
      };
    }

    const studentIds = students.map(s => s.userId);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: { in: studentIds },
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        studentId: true,
        status: true,
      },
    });

    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      attendanceMap[record.studentId] = record.status;
    });

    let attendanceList = students.map(s => ({
      studentId: s.userId,
      name: `${s.firstName} ${s.lastName}`,
      username: s.user.username,
      status: attendanceMap[s.userId] || "ABSENT",
    }));

    if (filter.toLowerCase() !== "all") {
      attendanceList = attendanceList.filter(
        a => a.status.toUpperCase() === filter.toUpperCase()
      );
    }

    const originalList = students.map(s => ({
      studentId: s.userId,
      name: `${s.firstName} ${s.lastName}`,
      username: s.user.username,
      status: attendanceMap[s.userId] || "ABSENT",
    }));

    const presentCount = originalList.filter(a => a.status === "PRESENT").length;
    const absentCount = originalList.filter(a => a.status === "ABSENT").length;
    const lateCount = originalList.filter(a => a.status === "LATE").length;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedList = attendanceList.slice(startIndex, endIndex);

    return {
      success: true,
      filter,
      totalStudents: students.length,
      total: attendanceList.length,
      page,
      limit,
      totalPages: Math.ceil(attendanceList.length / limit),
      stats: {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
      },
      data: paginatedList,
    };
  } catch (error) {
    throw error;
  }
};


function getWorkingDaysBetween(start, end) {
  const days = eachDayOfInterval({ start, end });
  return days.filter((d) => ![5, 6].includes(getDay(d))); 
}

exports.getStudentYearlyStats = async (studentId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: studentId },
      select: { createdAt: true },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const startDate = max([student.createdAt, yearStart]);
    const endDate = isBefore(now, yearEnd) ? now : yearEnd;

    const workingDays = getWorkingDaysBetween(startDate, endDate);

    const totalPresent = await prisma.attendance.count({
      where: {
        studentId,
        status: "PRESENT",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalWorkingDays = workingDays.length;
    const totalAbsent = totalWorkingDays - totalPresent;

    return {
      success: true,
      studentId,
      year: new Date().getFullYear(),
      totalWorkingDays,
      totalPresent,
      totalAbsent: totalAbsent < 0 ? 0 : totalAbsent,
    };
  } catch (error) {
    throw error;
  }
};

exports.getPresentHistory = async (studentId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const total = await prisma.attendance.count({
      where: { studentId },
    });

    const records = await prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }, 
      skip,
      take: limit,
      include: {
        teacher: {
          select: { id: true, username: true }, 
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};
