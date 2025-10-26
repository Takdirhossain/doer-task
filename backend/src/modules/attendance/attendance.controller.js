const apiResponse = require("../../utils/apiResponse");
const attendanceService = require("./attendance.service");
const catchAsync = require("../../utils/catchAsync");

exports.present = catchAsync(async (req, res) => {
  let studentId = req.user.id;
  const user = await attendanceService.present(studentId);
  res.json(apiResponse(true, "User registered successfully", user));
});

exports.getTodayAttendance = catchAsync(async (req, res) => {
  let teacherId = req.user.id;
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let filter = req.query.filter || "present";
  const user = await attendanceService.getTodayAttendance(
    teacherId,
    page,
    limit,
    filter
  );
  res.json(apiResponse(true, "Attendance fetched successfully", user));
});
exports.getStudentYearlyStats = catchAsync(async (req, res) => {
  let studentId = req.user.id;
  const user = await attendanceService.getStudentYearlyStats(studentId);
  res.json(apiResponse(true, "Attendance fetched successfully", user));
});
exports.getPresentHistory = catchAsync(async (req, res) => {
  let studentId = req.user.id;
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  const user = await attendanceService.getPresentHistory(
    studentId,
    page,
    limit
  );
  res.json(apiResponse(true, "Attendance fetched successfully", user));
});
