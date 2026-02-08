const { pool } = require('./db/index');
require('dotenv').config();

async function fix() {
    try {
        console.log("Deleting row with ID 4...");
        const [result] = await pool.execute('DELETE FROM user_platform WHERE id = 4');
        console.log("Deleted:", result.affectedRows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
fix();
