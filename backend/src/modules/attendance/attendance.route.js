const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth.middleware");
const checkPermission = require("../../middleware/checkPermission.middleware");
const { present, getTodayAttendance, getStudentYearlyStats, getPresentHistory } = require("./attendance.controller");
const PERMISSION = require("../../utils/permissions");

router.get("/present", auth, checkPermission(PERMISSION.ATTENDANCE.PRESENT, "ATTENDANCE"), present);
router.get("/get-today-attendance", auth, checkPermission(PERMISSION.ATTENDANCE.GET_TODAY_ATTENDANCE, "ATTENDANCE"), getTodayAttendance);
router.get("/get-student-yearly-stats", auth, checkPermission(PERMISSION.ATTENDANCE.GET_STUDENT_YEARLY_STATS, "ATTENDANCE"), getStudentYearlyStats);
router.get("/get-present-history", auth, checkPermission(PERMISSION.ATTENDANCE.GET_PRESENT_HISTORY, "ATTENDANCE"), getPresentHistory);

module.exports = router;
