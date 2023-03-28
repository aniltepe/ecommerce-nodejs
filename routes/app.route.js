const express = require('express');
const router = express.Router();

module.exports = router;

const controller = require("../controllers/app.controller");

router.get("/languages", controller.getLanguages);
router.get("/countries", controller.getCountries);
router.get("/regions", controller.getRegionsL0);
router.get("/language/:id", controller.getLanguage);
router.get("/country/:id", controller.getCountry);