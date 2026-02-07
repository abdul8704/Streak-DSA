const { pool } = require('../index');

const insertUserSolvedProblem = async (userId, platform, problemId, timestamp) => {
    try {
        const solvedAt = new Date(parseInt(timestamp) * 1000);
        const query = `
            INSERT INTO user_solved_problems (user_id, platform, problem_id, solved_at)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE solved_at = CASE 
                WHEN VALUES(solved_at) < solved_at THEN VALUES(solved_at) 
                ELSE solved_at 
            END
        `;
        const [result] = await pool.execute(query, [userId, platform, problemId, solvedAt]);
        return result;
    } catch (err) {
        console.error('Error inserting user solved problem', err);
        throw err;
    }
};

const insertUserHeatmap = async (userId, date, count) => {
    try {
        const query = `
            INSERT INTO user_heatmap (user_id, date, count_of_solved)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE count_of_solved = GREATEST(count_of_solved, VALUES(count_of_solved))
        `;
        const [result] = await pool.execute(query, [userId, date, count]);
        return result;
    } catch (err) {
        console.error('Error inserting user heatmap', err);
        throw err;
    }
};

const updateUserStreakStats = async (userId, maxStreak, currentStreak, highestSolvedOneDay) => {
    try {
        const query = `
            INSERT INTO user_streak_stats (user_id, max_streak, current_streak, highest_solved_one_day)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                max_streak = VALUES(max_streak),
                current_streak = VALUES(current_streak),
                highest_solved_one_day = VALUES(highest_solved_one_day)
        `;
        const [result] = await pool.execute(query, [userId, maxStreak, currentStreak, highestSolvedOneDay]);
        return result;
    } catch (err) {
        console.error('Error updating user streak stats', err);
        throw err;
    }
};

const deleteUserContestsByPlatform = async (userId, platform) => {
    try {
        const query = 'DELETE FROM user_contest WHERE user_id = ? AND platform = ?';
        const [result] = await pool.execute(query, [userId, platform]);
        return result;
    } catch (err) {
        console.error('Error deleting user contests', err);
        throw err;
    }
}

const insertUserContest = async (userId, platform, contestName, rank, rating, startTime) => {
    try {
        const contestDate = new Date(parseInt(startTime) * 1000); // timestamp is seconds
        const query = `
            INSERT INTO user_contest (user_id, platform, contest_name, contest_rank, rating, contest_date)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        // Use execute for single inserts. If bulk insert is needed later, we can optimize.
        // For typical user sync (updating a few contests), strict checking might be better.
        // But since we delete all first, simple insert is fine.
        const [result] = await pool.execute(query, [userId, platform, contestName, rank, rating, contestDate]);
        return result;
    } catch (err) {
        console.error('Error inserting user contest', err);
        throw err;
    }
}

const getUserContests = async (userId) => {
    try {
        const query = 'SELECT * FROM user_contest WHERE user_id = ? ORDER BY contest_date DESC';
        const [rows] = await pool.execute(query, [userId]);
        return rows;
    } catch (err) {
        console.error('Error fetching user contests', err);
        throw err;
    }
}

const getUserHeatmap = async (userId, startDate, endDate) => {
    try {
        let query = 'SELECT * FROM user_heatmap WHERE user_id = ?';
        const params = [userId];

        if (startDate && endDate) {
            query += ' AND date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        } else if (startDate) {
            query += ' AND date >= ?';
            params.push(startDate);
        }

        query += ' ORDER BY date ASC';

        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (err) {
        console.error('Error fetching user heatmap', err);
        throw err;
    }
}

const getUserIdByUsername = async (username) => {
    try {
        const query = 'SELECT user_id FROM users WHERE username = ?';
        const [rows] = await pool.execute(query, [username]);
        return rows[0]?.user_id;
    } catch (err) {
        console.error('Error fetching user ID', err);
        throw err;
    }
}

module.exports = {
    insertUserSolvedProblem,
    insertUserHeatmap,
    updateUserStreakStats,
    getUserIdByUsername,
    getUserIdByUsername,
    deleteUserContestsByPlatform,
    insertUserContest,
    getUserContests,
    getUserHeatmap
};
