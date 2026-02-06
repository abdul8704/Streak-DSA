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

    const recentSubmissions = response.data.data.recentAcSubmissionList;
    const dateMap = {};

    recentSubmissions.forEach(submission => {
        const date = new Date(parseInt(submission.timestamp) * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const dateKey = `${day} ${month} ${year}`;

        if (!dateMap[dateKey]) {
            dateMap[dateKey] = new Set();
        }
        dateMap[dateKey].add(submission.titleSlug);
    });

    const result = {};
    for (const [date, problems] of Object.entries(dateMap)) {
        result[date] = problems.size;
    }

    return result;
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

    const allSubmissionsSliced = allSubmissions.slice(0, targetCount);

    // Transform to { date: count }
    const dateMap = {};

    // Note: getLeetcodeAll returns statusDisplay in string, we might want to filter only AC?
    // But the user just said "do the same", and for getLeetcodeDaily it is "Recent AC Submissions".
    // For general submissions we should probably filter for statusDisplay === 'Accepted'.
    // Looking at the query in leetcode.js, it fetches statusDisplay.

    allSubmissionsSliced.forEach(submission => {
        // Only count accepted solutions to match "solved per day" logic generally expected
        if (submission.statusDisplay === 'Accepted') {
            const date = new Date(parseInt(submission.timestamp) * 1000);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const dateKey = `${day} ${month} ${year}`;

            if (!dateMap[dateKey]) {
                dateMap[dateKey] = new Set();
            }
            dateMap[dateKey].add(submission.titleSlug);
        }
    });

    const result = {};
    for (const [date, problems] of Object.entries(dateMap)) {
        result[date] = problems.size;
    }

    return result;
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
    const rawData = await getLeetcodeAllData(username);
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