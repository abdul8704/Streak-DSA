const { pool } = require('../index');

const insertUser = async (username, email, passwordHash) => {
    try {
        const query = `
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.execute(query, [username, email, passwordHash]);
        return result;
    } catch (err) {
        console.error('Error inserting user', err);
        throw err;
    }
};

const insertUserPlatform = async (userId, platform, handle) => {
    try {
        const query = `
            INSERT INTO user_platform (user_id, platform, platform_handle)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE platform_handle = VALUES(platform_handle)
        `;
        const [result] = await pool.execute(query, [userId, platform, handle]);
        console.log(result);
        return result;

    } catch (err) {
        console.error('Error inserting user platform', err);
        throw err;
    }
};

const checkUserExists = async (username, email) => {
    try {
        const query = `SELECT 1 FROM users WHERE username = ? OR email = ?`;
        const [rows] = await pool.execute(query, [username, email]);
        return rows.length > 0;
    } catch (err) {
        console.error('Error checking user existence', err);
        throw err;
    }
}


const getUserByUsername = async (username) => {
    try {
        const query = `SELECT * FROM users WHERE username = ?`;
        const [rows] = await pool.execute(query, [username]);
        return rows[0];
    } catch (err) {
        console.error('Error fetching user by username', err);
        throw err;
    }
};

const updateUser = async (username, email, passwordHash) => {
    try {
        let query;
        let params;

        if (passwordHash) {
            query = `UPDATE users SET email = ?, password_hash = ? WHERE username = ?`;
            params = [email, passwordHash, username];
        } else {
            query = `UPDATE users SET email = ? WHERE username = ?`;
            params = [email, username];
        }

        const [result] = await pool.execute(query, params);
        return result;
    } catch (err) {
        console.error('Error updating user', err);
        throw err;
    }
};

const getUserPlatformHandle = async (username, platform) => {
    try {
        const query = `
            SELECT up.platform_handle 
            FROM user_platform up
            JOIN users u ON u.user_id = up.user_id
            WHERE u.username = ? AND up.platform = ?
        `;
        const [rows] = await pool.execute(query, [username, platform]);
        return rows.length > 0 ? rows[0].platform_handle : null;
    } catch (err) {
        console.error('Error fetching user platform handle', err);
        throw err;
    }
};

const getUserPlatforms = async (username) => {
    try {
        const query = `
            SELECT up.platform, up.platform_handle 
            FROM user_platform up
            JOIN users u ON u.user_id = up.user_id
            WHERE u.username = ?
        `;
        const [rows] = await pool.execute(query, [username]);
        return rows;
    } catch (err) {
        console.error('Error fetching user platforms', err);
        throw err;
    }
};

module.exports = {
    insertUser,
    insertUserPlatform,
    checkUserExists,
    getUserByUsername,
    updateUser,
    getUserPlatformHandle,
    getUserPlatforms
};
