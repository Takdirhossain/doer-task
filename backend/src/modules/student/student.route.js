const express = require("express");
const router = express.Router();
const controller = require("./student.controller");
const multer = require("multer");
const auth = require("../../middleware/auth.middleware");

const upload = multer({ dest: "uploads/" });

router.post("/process-csv", auth, upload.single("file"), controller.uploadCsv);
router.post("/save-csv", auth, controller.saveCsv);
router.get("/student-list", auth, controller.list)
router.get("/:id", auth, controller.getById)
router.post("/profile-update/:id", auth, controller.update)
router.post("/create-student", auth, controller.createStudent)
router.post("/update-student/:id", auth, controller.updateStudent)
router.delete("/:id", auth, controller.remove)


module.exports = router;
