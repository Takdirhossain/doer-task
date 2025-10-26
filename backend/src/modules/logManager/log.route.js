const express   = require("express");
const router = express.Router();
const logController = require("./log.controller");
const auth = require("../../middleware/auth.middleware");
const checkPermission = require("../../middleware/checkPermission.middleware");
const PERMISSION = require("../../utils/permissions");

router.get("/get-logs", auth, checkPermission(PERMISSION.LOG.GET_LOGS, "LOG"), logController.getLogs);
router.get("/get-logger", auth, checkPermission(PERMISSION.LOG.GET_LOGGER, "LOG"), logController.getLogger);
module.exports = router;
