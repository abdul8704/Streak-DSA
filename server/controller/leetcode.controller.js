const leetcodeService = require('../service/leetcode.service');
const userManagementQueries = require('../db/queries/user_management');

const getLeetcodeDaily = async (req, res, next) => {
    try {
        // console.log(req.body);
        const username = req.body.username;
        const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
        if (!leetcodeHandle) {
            return res.status(404).json({ message: 'LeetCode handle not found for this user' });
        }
        const data = await leetcodeService.getLeetcodeDaily(leetcodeHandle);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

const getLeetcodeAllData = async (req, res, next) => {
    try {
        const { username, leetcode_session, csrf_token } = req.body;
        const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
        if (!leetcodeHandle) {
            return res.status(404).json({ message: 'LeetCode handle not found for this user' });
        }
        const data = await leetcodeService.getLeetcodeAllData(leetcodeHandle, leetcode_session, csrf_token);
        res.status(200).json(data);
    }
    catch (error) {
        // console.log(error);
        next(error);
    }
};

const getRawLeetcodeHeatMap = async (req, res, next) => {
    try {
        const username = req.body.username;
        const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
        if (!leetcodeHandle) return res.status(404).json({ message: 'LeetCode handle not found' });

        const data = await leetcodeService.getLeetcodeHeatMap(leetcodeHandle);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

const getContestData = async (req, res, next) => {
    try {
        const username = req.body.username;
        const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
        if (!leetcodeHandle) return res.status(404).json({ message: 'LeetCode handle not found' });

        const data = await leetcodeService.getLeetcodeContestData(leetcodeHandle);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

const getUserSolvedCount = async (req, res, next) => {
    try {
        const username = req.body.username;
        const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
        if (!leetcodeHandle) return res.status(404).json({ message: 'LeetCode handle not found' });

        const data = await leetcodeService.getUserSolvedCount(leetcodeHandle);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

const getDailyStats = async (req, res, next) => {
    try {
        const { username, period } = req.body;
        const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
        if (!leetcodeHandle) return res.status(404).json({ message: 'LeetCode handle not found' });

        const data = await leetcodeService.getLeetcodeDailyStats(leetcodeHandle, period);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    getLeetcodeDaily,
    getLeetcodeAllData,
    getRawLeetcodeHeatMap,
    getContestData,
    getUserSolvedCount,
    getDailyStats
};
