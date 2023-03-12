const express = require('express');
const router = express.Router();

module.exports = router;

const controller = require("../controllers/app.controller");

router.get("/locales", controller.getLocales);
router.get("/countries", controller.getCountries);
router.get("/regions", controller.getRegionsL0);
router.get("/locale/:id", controller.getLocale);
router.get("/country/:id", controller.getCountry);