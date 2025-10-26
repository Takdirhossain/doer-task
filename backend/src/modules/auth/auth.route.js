const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/signup",  authController.register);
router.post("/login",  authController.login);
router.get("/logout", auth, authController.logout);

module.exports = router;


