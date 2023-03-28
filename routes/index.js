const express = require('express');
const path = require('path');

const app = require('./app.route');
const user = require('./user.route');

const router = express.Router();

router.use('/api/', app);
router.use('/api/user', user);

module.exports = router;