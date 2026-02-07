const express = require('express');
const router = express.Router();
const userDataController = require('../controller/userData.controller');
const userUpdationService = require('../service/userUpdation.service');
const userUpdationController = require('../controller/userUpdations.controller'); // Reuse controller for sync triggers if needed, or define here

// Endpoints for fetching data
router.get('/:username/heatmap', userDataController.getHeatmap);
router.get('/:username/contests', userDataController.getContests);
router.get('/:username/streak', userDataController.getStreakCalendar);
router.get('/:username/graph', userDataController.getSolvedGraph);
router.get('/:username/stats', userDataController.getStats);

// Endpoint for triggering specific syncs (user requested separate method/endpoint)
router.post('/sync/contest', userUpdationController.syncContests);
router.post('/sync/heatmap', userUpdationController.syncHeatmap);


module.exports = router;
