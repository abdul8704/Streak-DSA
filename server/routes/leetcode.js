const express = require('express');
const router = express.Router();

const leetcodeController = require('../controller/leetcode.controller');

router.post('/daily', leetcodeController.getLeetcodeDaily);
router.post('/all', leetcodeController.getLeetcodeAllData);

module.exports = router;