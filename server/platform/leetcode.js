require('dotenv').config();

const getLeetcodeDaily = () => {
    return `
        query recentAcSubmissions($username: String!) {
            recentAcSubmissionList(username: $username, limit: 20) {
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

module.exports = {
    getLeetcodeDaily,
    getLeetcodeAll
}