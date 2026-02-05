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

module.exports = {
    getLeetcodeDaily,
    getLeetcodeAllData
};
