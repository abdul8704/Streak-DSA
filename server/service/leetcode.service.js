const axios = require('axios');
const Queries = require('../platform/leetcode');
const { formatSubmissionData, mapSubmissionCountsByDate } = require('../utils/leetcode.utils');
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

    const recentSubmissions = response.data.data.recentAcSubmissionList;
    return formatSubmissionData(recentSubmissions);
}

const getLeetcodeAllData = async (username, leetcodeSession, csrfToken) => {
    const query = Queries.getLeetcodeAll();
    const pageSize = 50;
    let offset = 0;
    let allSubmissions = [];

    while (true) {
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
                        "Cookie": `LEETCODE_SESSION=${leetcodeSession}; csrftoken=${csrfToken}`,
                        "x-csrftoken": csrfToken
                    }
                }
            );

            const submissionList = response.data.data.submissionList;
            const submissions = submissionList.submissions;
            const hasNext = submissionList.hasNext;

            if (submissions && submissions.length > 0) {
                allSubmissions.push(...submissions);
            }

            if (!hasNext) break;

            offset += pageSize;
        } catch (error) {
            console.error(`Error fetching submissions at offset ${offset}:`, error.message);
            if (error.response && error.response.data) {
                console.error("API Error Data:", JSON.stringify(error.response.data, null, 2));
            }

            // Check for Rate Limit (429) or Forbidden (403)
            if (error.response && (error.response.status === 403 || error.response.status === 429)) {
                console.warn(`Rate limit or Forbidden encountered. Waiting 1.5 minutes before retrying offset ${offset}...`);
                await delay(90000); // Wait 1.5 minutes
                continue; // Retry the same iteration (offset is not incremented)
            }

            throw error; // Propagate other errors
        }
    }

    return formatSubmissionData(allSubmissions);
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

    const normalizedCalendar = {};
    const calendar = JSON.parse(rawCalendar);

    for (const [timestamp, count] of Object.entries(calendar)) {
        // LeetCode returns timestamps in seconds
        const date = new Date(parseInt(timestamp) * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;

        normalizedCalendar[formattedDate] = count;
    }

    return normalizedCalendar;
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

const getLeetcodeDailyStats = async (username, period) => {
    const submissions = await getLeetcodeDaily(username);
    const rawData = mapSubmissionCountsByDate(submissions);
    const result = {};

    const parseDate = (dateStr) => new Date(dateStr);

    if (period === 'all time') {
        const sortedKeys = Object.keys(rawData).sort((a, b) => parseDate(a) - parseDate(b));
        sortedKeys.forEach(k => {
            result[k] = rawData[k];
        });
        return result;
    }

    let daysToLookBack = 30;
    if (period === 'last 90 days') {
        daysToLookBack = 90;
    }

    // Generate dates from (Today - daysToLookBack + 1) to Today
    for (let i = daysToLookBack - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        const day = d.getDate();
        const month = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();
        const key = `${day} ${month} ${year}`;

        result[key] = rawData[key] || 0;
    }

    return result;
}

module.exports = {
    getLeetcodeDaily,
    getLeetcodeAllData,
    getLeetcodeHeatMap,
    getLeetcodeContestData,
    getUserSolvedCount,
    getLeetcodeDailyStats
}