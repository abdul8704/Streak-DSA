const express = require('express');
const router = express.Router();

const leetcodeController = require('../controller/leetcode.controller');

router.post('/daily', leetcodeController.getLeetcodeDaily);
router.post('/all', leetcodeController.getLeetcodeAllData);
router.post('/heatmap', leetcodeController.getRawLeetcodeHeatMap);
router.post('/contest', leetcodeController.getContestData);
router.post('/solved', leetcodeController.getUserSolvedCount);
router.post('/daily-stats', leetcodeController.getDailyStats);

module.exports = router;