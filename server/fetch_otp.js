const mysql = require('mysql2/promise');
require('dotenv').config();

async function getOTP() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_SERVER,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        const [rows] = await connection.execute('SELECT * FROM verification_codes WHERE type="signup" ORDER BY expires_at DESC LIMIT 1');
        if (rows.length > 0) {
            console.log("OTP:", rows[0].code);
        } else {
            console.log("No OTP found");
        }
        await connection.end();
    } catch (e) {
        console.error(e);
    }
}

getOTP();
