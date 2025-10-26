const express   = require("express");
const router = express.Router();
const logController = require("./log.controller");
const auth = require("../../middleware/auth.middleware");

router.get("/get-logs", auth, logController.getLogs);
router.get("/get-logger", auth, logController.getLogger);
module.exports = router;
