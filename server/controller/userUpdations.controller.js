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

module.exports = {
    syncUserSubmissions,
    syncDaily,
    createUser,
    addPlatformHandles
};
