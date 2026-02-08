const userManagementQueries = require('./db/queries/user_management');
const { pool } = require('./db/index');
require('dotenv').config();

async function debug() {
    try {
        console.log("Calling getUserPlatformHandle for user_test_2...");
        const handle = await userManagementQueries.getUserPlatformHandle('user_test_2', 'leetcode');
        console.log("Result from helper:", handle);

        // console.log("Running raw query...");
        // const [rows] = await pool.execute('SELECT * FROM user_platform up JOIN users u ON u.user_id = up.user_id WHERE u.username = "user_test_2"');
        // console.log("Raw query rows:", rows);

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
debug();
