const leetcodeService = require('../service/leetcode.service');

const getLeetcodeDaily = async (req, res, next) => {
    try {
        // console.log(req.body);
        const username = req.body.username;
        const data = await leetcodeService.getLeetcodeDaily(username);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

const getLeetcodeAllData = async (req, res, next) => {
    try {
        const username = req.body.username;
        const data = await leetcodeService.getLeetcodeAllData(username);
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
        const data = await leetcodeService.getLeetcodeHeatMap(username);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

const getContestData = async (req, res, next) => {
    try {
        const username = req.body.username;
        const data = await leetcodeService.getLeetcodeContestData(username);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

const getUserSolvedCount = async (req, res, next) => {
    try {
        const username = req.body.username;
        const data = await leetcodeService.getUserSolvedCount(username);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};

const getDailyStats = async (req, res, next) => {
    try {
        const { username, period } = req.body;
        const data = await leetcodeService.getLeetcodeDailyStats(username, period);
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
