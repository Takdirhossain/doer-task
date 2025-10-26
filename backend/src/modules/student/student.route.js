const express = require("express");
const router = express.Router();
const controller = require("./student.controller");
const multer = require("multer");
const auth = require("../../middleware/auth.middleware");
const checkPermission = require("../../middleware/checkPermission.middleware");
const PERMISSION = require("../../utils/permissions")

const upload = multer({ dest: "uploads/" });

router.get("/export-list", auth, checkPermission(PERMISSION.STUDENT.EXPORT_LIST, "STUDENT"), controller.exportStudents)
router.post("/process-csv", auth, checkPermission(PERMISSION.STUDENT.PROCESS_CSV, "STUDENT"), upload.single("file"), controller.uploadCsv);
router.post("/save-csv", auth, checkPermission(PERMISSION.STUDENT.SAVE_CSV, "STUDENT"), controller.saveCsv);
router.get("/student-list", auth, checkPermission(PERMISSION.STUDENT.STUDENT_LIST, "STUDENT"), controller.list)
router.get("/:id", auth, checkPermission(PERMISSION.STUDENT.STUDENT_BY_ID, "STUDENT"), controller.getById)
router.post("/profile-update/:id", auth, checkPermission(PERMISSION.STUDENT.PROFILE_UPDATE, "STUDENT"), controller.update)
router.post("/create-student", auth, checkPermission(PERMISSION.STUDENT.CREATE_STUDENT, "STUDENT"), controller.createStudent)
router.post("/update-student/:id", auth, checkPermission(PERMISSION.STUDENT.UPDATE_STUDENT, "STUDENT"), controller.updateStudent)
router.delete("/:id", auth, checkPermission(PERMISSION.STUDENT.DELETE, "STUDENT"), controller.remove)


module.exports = router;
