const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

const setupDB = async () => {
    let connection;
    try {
        console.log('Connecting to DB...');
        connection = await mysql.createConnection({
            host: process.env.DB_SERVER,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        console.log('Connected!');

        console.log('Setting up verification_codes table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS verification_codes (
                email VARCHAR(255) NOT NULL,
                code VARCHAR(10) NOT NULL,
                type ENUM('signup', 'reset') NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                PRIMARY KEY (email, type)
            )
        `;

        await connection.execute(createTableQuery);
        console.log('verification_codes table created successfully.');

        process.exit(0);
    } catch (error) {
        console.error('DB Setup failed:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
};

setupDB();
