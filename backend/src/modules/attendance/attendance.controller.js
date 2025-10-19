
const apiResponse = require("../../utils/apiResponse");
const attendanceService = require("./attendance.service");

exports.present = async (req, res) => {
    try {  
      let studentId = req.user.id;
      const user = await attendanceService.present(studentId);
      res.json(apiResponse(true, 'User registered successfully', user));
    } catch (err) {
      res.status(400).json(apiResponse(false, err.message));
    }
  };

  exports.getTodayAttendance = async (req, res) => {
    try {
      let teacherId = req.user.id;
      let page = req.query.page || 1;
      let limit = req.query.limit || 10;
      let filter = req.query.filter || "all";
      const user = await attendanceService.getTodayAttendance(teacherId, page, limit, filter);
      res.json(apiResponse(true, 'Attendance fetched successfully', user));
    } catch (err) {
      res.status(400).json(apiResponse(false, err.message));
    }
  };
  exports.getStudentYearlyStats = async (req, res) => {
    try {
      let studentId = req.user.id;
      const user = await attendanceService.getStudentYearlyStats(studentId);
      res.json(apiResponse(true, 'Attendance fetched successfully', user));
    } catch (err) {
      res.status(400).json(apiResponse(false, err.message));
    }
  };
  exports.getPresentHistory = async (req, res) => {
    try {
      let studentId = req.user.id;
      const user = await attendanceService.getPresentHistory(studentId);
      res.json(apiResponse(true, 'Attendance fetched successfully', user));
    } catch (err) {
      res.status(400).json(apiResponse(false, err.message));
    }
  };