const userUpdationService = require('../service/userUpdation.service');

const syncUserSubmissions = async (req, res, next) => {
    try {
        const { username, leetcode_session, csrf_token } = req.body;

        if (!username || !leetcode_session || !csrf_token) {
            return res.status(400).json({ message: 'Missing required fields: username, leetcode_session, csrf_token' });
        }

        const result = await userUpdationService.syncUserSubmissions(username, leetcode_session, csrf_token);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields: username, email, password' });
        }

        const result = await userUpdationService.createUser(username, email, password);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const addPlatformHandles = async (req, res, next) => {
    try {
        const { username, platforms } = req.body;
        console.log(req.body)

        if (!username || !Array.isArray(platforms)) {
            return res.status(400).json({ message: 'Invalid input: username and platforms (array) are required' });
        }

        const result = await userUpdationService.addPlatformHandles(username, platforms);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const syncDaily = async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Missing required field: username' });
        }

        const result = await userUpdationService.syncUserDaily(username);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const syncContests = async (req, res, next) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: "Username required" });
        const count = await userUpdationService.syncContestsByUsername(username);
        res.status(200).json({ message: 'Contests synced', count });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
}

const syncHeatmap = async (req, res, next) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: "Username required" });
        const count = await userUpdationService.syncHeatmapByUsername(username);
        res.status(200).json({ message: 'Heatmap synced', updatedDays: count });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
}

const getUserPlatforms = async (req, res, next) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        const platforms = await userUpdationService.getUserPlatforms(username);
        res.status(200).json(platforms);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    syncUserSubmissions,
    syncDaily,
    syncContests,
    syncHeatmap,
    createUser,
    addPlatformHandles,
    getUserPlatforms
};
