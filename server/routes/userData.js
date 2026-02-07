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

// Endpoint for triggering specific syncs (user requested separate method/endpoint)
// Since userUpdationController already has /sync which does everything,
// We might want specific endpoints like /sync/contests or /sync/heatmap
// I'll add them here using a wrapper to call the service directly or add to controller.

router.post('/sync/contest', async (req, res) => {
    try {
        const { username } = req.body;
        // Need ID? The service takes ID and username.
        // We need to resolve ID first.
        const userSubmissionQueries = require('../db/queries/user_submission');
        const userId = await userSubmissionQueries.getUserIdByUsername(username);

        if (!userId) return res.status(404).json({ error: "User not found" });

        const count = await userUpdationService.syncUserContests(userId, username);
        res.status(200).json({ message: 'Contests synced', count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/sync/heatmap', async (req, res) => {
    try {
        const { username } = req.body;
        const userSubmissionQueries = require('../db/queries/user_submission');
        const userId = await userSubmissionQueries.getUserIdByUsername(username);

        if (!userId) return res.status(404).json({ error: "User not found" });

        const count = await userUpdationService.syncUserHeatmap(userId, username);
        res.status(200).json({ message: 'Heatmap synced', updatedDays: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
