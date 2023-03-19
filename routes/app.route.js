const express = require('express');
const router = express.Router();

module.exports = router;

const controller = require("../controllers/app.controller");

router.get("/langs", controller.getLangs);
router.get("/countries", controller.getCountries);
router.get("/regions", controller.getRegionsL0);
router.get("/lang/:id", controller.getLang);
router.get("/country/:id", controller.getCountry);