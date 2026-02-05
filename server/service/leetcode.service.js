const axios = require('axios');
const Queries = require('../platform/leetcode');
require('dotenv').config();

const LEETCODE_ENDPOINT = process.env.LEETCODE_ENDPOINT;
const LEETCODE_URL = process.env.LEETCODE_URL;

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
            throw error; // Propagate to controller
        }
    }

    return allSubmissions.slice(0, targetCount);
}


module.exports = {
    getLeetcodeDaily,
    getLeetcodeAllData
}