const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function getOTP() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_SERVER,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        const [rows] = await connection.execute('SELECT * FROM verification_codes ORDER BY expires_at DESC LIMIT 1');
        console.log("OTP:", rows[0]?.code);
        await connection.end();
    } catch (e) {
        console.error(e);
    }
}

getOTP();
