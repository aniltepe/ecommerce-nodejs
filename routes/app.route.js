const express = require('express');
const router = express.Router();

module.exports = router;

const controller = require("../controllers/app.controller");

router.get("/locales", controller.getLocales);
router.get("/countries", controller.getCountries);