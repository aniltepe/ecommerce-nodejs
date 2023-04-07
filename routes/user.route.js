const express = require('express');
const router = express.Router();

module.exports = router;

const controller = require("../controllers/user.controller");

router.get("/auth", controller.auth);
router.post("/login", controller.login);
router.post("/signup", controller.signup);
router.post("/logout", controller.logout);
router.get("/checkusername/:username", controller.checkUsernameExists);
router.get("/checkemail/:email", controller.checkEmailExists);
router.get("/checkphone/:phone", controller.checkPhoneExists);