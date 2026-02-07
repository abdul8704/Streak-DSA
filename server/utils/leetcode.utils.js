const formatSubmissionData = (submissions) => {
    return submissions
        .filter(submission => !submission.statusDisplay || submission.statusDisplay === 'Accepted')
        .map(submission => ({
            problem_id: submission.titleSlug,
            problem_title: submission.title,
            timestamp: submission.timestamp
        }));
}

const mapSubmissionCountsByDate = (submissions) => {
    const dateMap = {};

    submissions.forEach(submission => {
        const date = new Date(parseInt(submission.timestamp) * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const dateKey = `${day} ${month} ${year}`;

        if (!dateMap[dateKey]) {
            dateMap[dateKey] = new Set();
        }
        dateMap[dateKey].add(submission.problem_id);
    });

    const result = {};
    for (const [date, problems] of Object.entries(dateMap)) {
        result[date] = problems.size;
    }

    return result;
}

module.exports = { formatSubmissionData, mapSubmissionCountsByDate };
