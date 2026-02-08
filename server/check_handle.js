const { pool } = require('./db/index');
require('dotenv').config();

async function check() {
    try {
        const [users] = await pool.execute('SELECT user_id FROM users WHERE username = "user_test_2"');
        if (users.length === 0) return console.log("User not found");

        const userId = users[0].user_id;
        const [handles] = await pool.execute('SELECT * FROM user_platform WHERE user_id = ?', [userId]);
        console.log(`Found ${handles.length} handles:`);
        handles.forEach(h => console.log(`- ${h.platform}: ${h.platform_handle} (ID: ${h.id})`));

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
check();
