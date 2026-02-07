require('dotenv').config();
const userDataService = require('./service/userData.service');
const userUpdationService = require('./service/userUpdation.service');
const { pool } = require('./db/index');
const fs = require('fs');

const username = 'abdulaziz120';

async function run() {
    const logF = (msg) => {
        console.log(msg);
        fs.appendFileSync('verification_data.txt', msg + '\n');
    };

    // Clear previous log
    fs.writeFileSync('verification_data.txt', '');

    logF(`Starting full sync & verification for user: ${username}`);

    try {
        const userIdResult = await pool.execute('SELECT user_id FROM users WHERE username = ?', [username]);
        if (!userIdResult[0].length) throw new Error('User not found in DB');
        const userId = userIdResult[0][0].user_id;

        // 1. Sync Heatmap explicitly
        logF('--- Syncing Heatmap ---');
        const daysSynced = await userUpdationService.syncUserHeatmap(userId, username);
        logF(`Synced ${daysSynced} days of heatmap data.`);

        // 2. Fetch Heatmap Data (All)
        logF('--- Fetching Heatmap (All) ---');
        const heatmap = await userDataService.getHeatmapData(username);
        logF(`Heatmap entries: ${Object.keys(heatmap).length}`);

        // 3. Fetch Heatmap Data (Range) - e.g., 2026-01-01 to 2026-02-01
        logF('--- Fetching Heatmap (Jan 2026) ---');
        const heatmapJan = await userDataService.getHeatmapData(username, '2026-01-01', '2026-01-31');
        logF(`Heatmap Jan 2026 entries: ${Object.keys(heatmapJan).length}`);

        // 4. Streak Calendar (Feb 2026)
        logF('--- Fetching Streak Calendar (Feb 2026) ---');
        const streakCal = await userDataService.getStreakCalendarData(username, '2', '2026');
        logF(`Streak Data Sample (Feb): ${JSON.stringify(Object.entries(streakCal).slice(0, 3))}`);

        // 5. Contests
        logF('--- Fetching Contests ---');
        const contests = await userDataService.getUserContests(username);
        logF(`Contests found: ${contests.length}`);
        if (contests.length > 0) logF(`First contest: ${contests[0].contest_name}, Rank: ${contests[0].contest_rank}`);

        // 6. Solved Graph (Last 7 days)
        logF('--- Fetching Solved Graph (Last 7 days) ---');
        const graph7 = await userDataService.getProblemsSolvedGraphData(username, 'last 7 days');
        logF(`Graph Data Length: ${graph7.length}`);
        if (graph7.length > 0) logF(`Last graph point: ${JSON.stringify(graph7[graph7.length - 1])}`);

    } catch (e) {
        logF(`Test Failed: ${e.message}`);
        console.error(e);
    } finally {
        await pool.end();
    }
}
run();
