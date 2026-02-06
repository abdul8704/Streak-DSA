require('dotenv').config();

const getLeetcodeDaily = () => {
    return `
        query recentAcSubmissions($username: String!) {
            recentAcSubmissionList(username: $username, limit: 50) {
            id
            title
            titleSlug
            timestamp
            }
        }
    `;
}

const getLeetcodeAll = () => {
    return `
        query submissionList($offset: Int!, $limit: Int!) {
        submissionList(
            offset: $offset
            limit: $limit
        ) {
            submissions {
            id
            title
            titleSlug
            statusDisplay
            timestamp
            }
        }
        }
    `;
}

const getSubmissionHeatmap = () => {
    return `
        query getCalendar($username: String!) {
            matchedUser(username: $username) {
            submissionCalendar
            }
        }
    `;
}

const getContestData = () => {
    return `
        query getContestRating($username: String!) {
            userContestRankingHistory(username: $username) {
                attended
                rating
                ranking
                contest {
                    title
                }
            }
        }
    `;
}

const getUserProfile = () => {
    return `
        query getUserProfile($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
                }
            }
        }`
}

module.exports = {
    getLeetcodeDaily,
    getLeetcodeAll,
    getSubmissionHeatmap,
    getContestData,
    getUserProfile
}