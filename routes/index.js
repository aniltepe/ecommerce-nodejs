const express = require('express');
const path = require('path');

const app = require('./app.route');

const router = express.Router();

router.use('/api/', app);

module.exports = router;