const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkHandle() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_SERVER,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        const [users] = await connection.execute('SELECT user_id FROM users WHERE username = ?', ['user_test_2']);
        if (users.length === 0) {
            console.log("User not found");
            await connection.end();
            return;
        }
        const userId = users[0].user_id;

        const [rows] = await connection.execute('SELECT * FROM user_platform WHERE user_id = ? AND platform = "leetcode"', [userId]);
        console.log("Platform Data:", rows);
        await connection.end();
    } catch (e) {
        console.error(e);
    }
}

checkHandle();
