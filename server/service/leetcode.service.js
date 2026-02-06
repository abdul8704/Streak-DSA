const axios = require('axios');
const Queries = require('../platform/leetcode');
require('dotenv').config();

const LEETCODE_ENDPOINT = process.env.LEETCODE_ENDPOINT;
const LEETCODE_URL = process.env.LEETCODE_URL;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getLeetcodeDaily = async (username) => {
    const query = Queries.getLeetcodeDaily();

    const response = await axios.post(
        LEETCODE_ENDPOINT,
        {
            query,
            variables: { username }
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Referer": `${LEETCODE_URL}`
            }
        }
    );

    return response.data.data.recentAcSubmissionList;
}

const getLeetcodeAllData = async (username) => {
    const query = Queries.getLeetcodeAll();
    // console.log(query);
    const pageSize = 50; // safe batch size
    let offset = 0;
    let allSubmissions = [];
    const targetCount = 1000; // Number of submissions to fetch

    while (allSubmissions.length < targetCount) {
        try {
            const response = await axios.post(
                LEETCODE_ENDPOINT,
                {
                    query,
                    variables: { offset, limit: pageSize }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Referer": `${LEETCODE_URL}`,
                        "Cookie": `LEETCODE_SESSION=${process.env.LEETCODE_SESSION}; csrftoken=${process.env.CSRF_TOKEN}`,
                        "x-csrftoken": process.env.CSRF_TOKEN
                    }
                }
            );

            const submissions = response.data.data.submissionList.submissions;

            if (!submissions || submissions.length === 0) break;

            allSubmissions.push(...submissions);
            offset += pageSize;
        } catch (error) {
            console.error(`Error fetching submissions at offset ${offset}:`, error.message);
            if (error.response && error.response.data) {
                console.error("API Error Data:", JSON.stringify(error.response.data, null, 2));
            }

            // Check for Rate Limit (429) or Forbidden (403)
            if (error.response && (error.response.status === 403 || error.response.status === 429)) {
                console.warn(`Rate limit or Forbidden encountered. Waiting 1 minute before retrying offset ${offset}...`);
                await delay(60000); // Wait 1 minute
                continue; // Retry the same iteration (offset is not incremented)
            }

            throw error; // Propagate other errors to controller
        }
    }

    return allSubmissions.slice(0, targetCount);
}

const getLeetcodeHeatMap = async (username) => {
    const query = Queries.getSubmissionHeatmap();

    const response = await axios.post(
        LEETCODE_ENDPOINT,
        {
            query,
            variables: { username }
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Referer": LEETCODE_URL
            }
        }
    );

    const rawCalendar =
        response.data.data.matchedUser.submissionCalendar;

    const calendar = JSON.parse(rawCalendar);

    return calendar;
}

const getLeetcodeContestData = async (username) => {
    const query = Queries.getContestData();

    const response = await axios.post(
        LEETCODE_ENDPOINT,
        {
            query,
            variables: { username }
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Referer": LEETCODE_URL
            }
        }
    );

    return response.data.data.userContestRankingHistory;
}

const getUserSolvedCount = async (username) => {
    const query = Queries.getUserProfile();

    const response = await axios.post(
        LEETCODE_ENDPOINT,
        {
            query,
            variables: { username }
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Referer": LEETCODE_URL
            }
        }
    );

    const solved = response.data.data.matchedUser.submitStats.acSubmissionNum;
    const total = response.data.data.allQuestionsCount;

    return solved.map(s => {
        const t = total.find(t => t.difficulty === s.difficulty);
        return {
            difficulty: s.difficulty,
            count: s.count,
            submissions: t ? t.count : 0
        };
    });
}

module.exports = {
    getLeetcodeDaily,
    getLeetcodeAllData,
    getLeetcodeHeatMap,
    getLeetcodeContestData,
    getUserSolvedCount
}