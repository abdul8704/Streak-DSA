const userDataService = require('../service/userData.service');

const getHeatmap = async (req, res) => {
    try {
        const { username } = req.params;
        const { start, end } = req.query; // optional date range
        const data = await userDataService.getHeatmapData(username, start, end);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getContests = async (req, res) => {
    try {
        const { username } = req.params;
        const data = await userDataService.getUserContests(username);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getStreakCalendar = async (req, res) => {
    try {
        const { username } = req.params;
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ error: 'Month and Year are required' });
        }

        const data = await userDataService.getStreakCalendarData(username, month, year);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSolvedGraph = async (req, res) => {
    try {
        const { username } = req.params;
        const { range } = req.query; // e.g., 'last 30 days'
        const data = await userDataService.getProblemsSolvedGraphData(username, range);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getHeatmap,
    getContests,
    getStreakCalendar,
    getSolvedGraph
};
