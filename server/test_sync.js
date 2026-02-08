const userUpdationService = require('./service/userUpdation.service');
const { pool } = require('./db/index');
const fs = require('fs');
require('dotenv').config();

async function testSync() {
    try {
        console.log("Starting sync for user_test_2...");
        const result = await userUpdationService.syncUserDaily('user_test_2');
        console.log("Sync success");
        fs.writeFileSync('sync_log.txt', JSON.stringify(result, null, 2));
    } catch (error) {
        const errorLog = `Error: ${error.message}\nStack: ${error.stack}`;
        fs.writeFileSync('sync_log.txt', errorLog);
        console.error(errorLog);
    } finally {
        await pool.end();
    }
}

testSync();
