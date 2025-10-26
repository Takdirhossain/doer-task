const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth.middleware");
const { present, getTodayAttendance, getStudentYearlyStats, getPresentHistory } = require("./attendance.controller");

router.get("/present", auth, present);
router.get("/get-today-attendance", auth, getTodayAttendance);
router.get("/get-student-yearly-stats", auth, getStudentYearlyStats);
router.get("/get-present-history", auth, getPresentHistory);

module.exports = router;
