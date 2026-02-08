const userSubmissionQueries = require('../db/queries/user_submission');

const getUserIdOrThrow = async (username) => {
    const userId = await userSubmissionQueries.getUserIdByUsername(username);
    if (!userId) {
        throw new Error('User not found');
    }
    return userId;
}

const getHeatmapData = async (username, startDate, endDate) => {
    try {
        const userId = await getUserIdOrThrow(username);
        const data = await userSubmissionQueries.getUserHeatmap(userId, startDate, endDate);

        const result = {};
        data.forEach(row => {
            let dateStr = row.date;
            if (row.date instanceof Date) {
                const y = row.date.getFullYear();
                const m = String(row.date.getMonth() + 1).padStart(2, '0');
                const d = String(row.date.getDate()).padStart(2, '0');
                dateStr = `${y}-${m}-${d}`;
            }
            result[dateStr] = row.count_of_solved;
        });

        return result;
    } catch (error) {
        console.error('Error fetching heatmap data:', error);
        throw error;
    }
}

const getUserContests = async (username) => {
    try {
        const userId = await getUserIdOrThrow(username);
        return await userSubmissionQueries.getUserContests(userId);
    } catch (error) {
        console.error('Error fetching user contests:', error);
        throw error;
    }
}

const getStreakCalendarData = async (username, month, year) => {
    try {
        const userId = await getUserIdOrThrow(username);

        let startM = parseInt(month);
        let startY = parseInt(year);

        if (isNaN(startM) || isNaN(startY)) {
            throw new Error('Invalid month/year');
        }

        const startStr = `${startY}-${String(startM).padStart(2, '0')}-01`;
        const daysInMonth = new Date(startY, startM, 0).getDate();
        const endStr = `${startY}-${String(startM).padStart(2, '0')}-${daysInMonth}`;

        const data = await userSubmissionQueries.getSolvedProblemsCountByDate(userId, startStr, endStr);

        const result = {};
        data.forEach(row => {
            let dateStr = row.date;
            if (row.date instanceof Date) {
                const y = row.date.getFullYear();
                const m = String(row.date.getMonth() + 1).padStart(2, '0');
                const d = String(row.date.getDate()).padStart(2, '0');
                dateStr = `${y}-${m}-${d}`;
            }
            result[dateStr] = row.count_of_solved;
        });
        return result;

    } catch (error) {
        console.error('Error fetching streak calendar data:', error);
        throw error;
    }
}

const getProblemsSolvedGraphData = async (username, range) => {
    try {
        const userId = await getUserIdOrThrow(username);

        let startDate = null;
        let endDate = new Date(); // Today

        if (range && range !== 'all-time') {
            const d = new Date();
            if (range === 'last-7-days') {
                d.setDate(d.getDate() - 7);
            } else if (range === 'last-30-days') {
                d.setDate(d.getDate() - 30);
            } else if (range === 'last-90-days') {
                d.setDate(d.getDate() - 90);
            }

            d.setHours(0, 0, 0, 0);

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            startDate = `${year}-${month}-${day}`;
        }

        const now = endDate;
        const endYear = now.getFullYear();
        const endMonth = String(now.getMonth() + 1).padStart(2, '0');
        const endDay = String(now.getDate()).padStart(2, '0');
        const endStr = `${endYear}-${endMonth}-${endDay}`;

        const data = await userSubmissionQueries.getSolvedProblemsCountByDate(userId, startDate, endStr);

        return data.map(row => {
            let dateStr = row.date instanceof Date ? row.date : row.date;
            if (row.date instanceof Date) {
                const y = row.date.getFullYear();
                const m = String(row.date.getMonth() + 1).padStart(2, '0');
                const d = String(row.date.getDate()).padStart(2, '0');
                dateStr = `${y}-${m}-${d}`;
            }
            return {
                date: dateStr,
                count: row.count_of_solved
            };
        });

    } catch (error) {
        console.error('Error fetching solved problems graph data:', error);
        throw error;
    }
}

const getUserStats = async (username) => {
    try {
        const userId = await getUserIdOrThrow(username);
        const stats = await userSubmissionQueries.getUserStreakStats(userId);

        // Calculate Solved Today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        const todayStr = `${y}-${m}-${d}`;

        const solvedToday = await userSubmissionQueries.getSolvedCountForDate(userId, todayStr);

        // Calculate Current Streak Dynamically
        const solvedDatesRaw = await userSubmissionQueries.getDistinctSolvedDates(userId);
        // solvedDatesRaw is array of [{ solved_date: Date }, ... ] sorted DESC

        const solvedDatesSet = new Set(solvedDatesRaw.map(row => {
            const date = row.solved_date; // Date object
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        }));

        let currentStreak = 0;
        let checkDate = new Date(today);

        while (true) {
            const y = checkDate.getFullYear();
            const m = String(checkDate.getMonth() + 1).padStart(2, '0');
            const day = String(checkDate.getDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${day}`;

            if (solvedDatesSet.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        // Use stored max streak, but checking if current > stored max (in case stats table is outdated)
        let maxStreak = stats?.max_streak || 0;
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }

        return {
            maxStreak: maxStreak,
            currentStreak: currentStreak,
            highestSolvedOneDay: stats?.highest_solved_one_day || solvedToday, // Fallback
            solvedToday: solvedToday
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
}

module.exports = {
    getHeatmapData,
    getUserContests,
    getStreakCalendarData,
    getProblemsSolvedGraphData,
    getUserStats
};
