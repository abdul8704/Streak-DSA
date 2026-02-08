const mysql = require('mysql2/promise');
require('dotenv').config(); // Local .env

const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    username: 'testuser_' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'Password123!',
    newPassword: 'NewPassword456!'
};

let cookie = null;

const getOTP = async (email, type) => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_SERVER,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const [rows] = await connection.execute(
            'SELECT code FROM verification_codes WHERE email = ? AND type = ?',
            [email, type]
        );
        return rows.length > 0 ? rows[0].code : null;
    } finally {
        if (connection) await connection.end();
    }
};

const runTest = async () => {
    try {
        console.log('--- STARTING AUTH FLOW TEST ---');
        console.log('Test User:', TEST_USER.username);

        // 1. Initiate Signup
        console.log('\n1. Initiating Signup...');
        let res = await fetch(`${API_URL}/signup/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: TEST_USER.username,
                email: TEST_USER.email,
                password: TEST_USER.password
            })
        });
        if (!res.ok) throw new Error(await res.text());
        console.log('   Signup Initiated.');

        // Wait a bit for DB
        await new Promise(r => setTimeout(r, 1000));

        // 2. Get OTP from DB
        console.log('   Fetching OTP from DB...');
        let otp = await getOTP(TEST_USER.email, 'signup');
        console.log('   OTP found:', otp);

        if (!otp) throw new Error("OTP not found in DB");

        // 3. Verify Signup
        console.log('\n2. Verifying Signup...');
        res = await fetch(`${API_URL}/signup/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: TEST_USER.username,
                email: TEST_USER.email,
                password: TEST_USER.password,
                otp: otp
            })
        });
        if (!res.ok) throw new Error(await res.text());
        console.log('   Signup Verified & User Created.');

        // 4. Login
        console.log('\n3. Logging In...');
        res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: TEST_USER.username,
                password: TEST_USER.password
            })
        });
        if (!res.ok) throw new Error(await res.text());

        const loginData = await res.json();
        console.log('   Login Successful. User:', loginData.username);

        // Extract Cookie
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            cookie = setCookie.split(';')[0];
            console.log('   Cookie received:', cookie);
        } else {
            console.error('   NO COOKIE RECEIVED! (Might be HttpOnly and fetch behaves differently in Node, check cookie-parser config)');
            // Note: Node fetch might not expose Set-Cookie easily if not using a library, but usually headers.get('set-cookie') works in newer node/undici.
            // If this fails, we can't test /me fully without a library like 'node-fetch-cookies'.
            // But let's try.
        }

        // 5. Check Me
        if (cookie) {
            console.log('\n4. Checking Session (/me)...');
            res = await fetch(`${API_URL}/me`, {
                headers: { Cookie: cookie }
            });
            if (res.ok) {
                const meData = await res.json();
                console.log('   Session Valid. User:', meData.username);
            } else {
                console.error('   Session Invalid:', await res.text());
            }
        } else {
            console.log('   Skipping session check due to missing login cookie capture.');
        }

        // 6. Logout
        console.log('\n5. Logging Out...');
        res = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie }
        });
        if (!res.ok) console.error('Logout failed');
        else console.log('   Logout Successful.');

        // 7. Verify Logout
        console.log('   Verifying logout...');
        res = await fetch(`${API_URL}/me`, {
            headers: { Cookie: cookie }
        });
        if (res.status === 401) {
            console.log('   SUCCESS: Session invalid after logout (Expected 401).');
        } else {
            console.error('   FAILED: Session still valid or other error:', res.status);
        }

        // 8. Forgot Password Request
        console.log('\n6. forgot Password Request...');
        res = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: TEST_USER.email })
        });
        if (!res.ok) throw new Error(await res.text());
        console.log('   Request Sent.');

        // 9. Get Reset OTP
        console.log('   Fetching Reset OTP from DB...');
        await new Promise(r => setTimeout(r, 1000));
        otp = await getOTP(TEST_USER.email, 'reset');
        console.log('   OTP found:', otp);

        if (!otp) throw new Error("Reset OTP not found");

        // 10. Reset Password
        console.log('\n7. Resetting Password...');
        res = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_USER.email,
                otp: otp,
                newPassword: TEST_USER.newPassword
            })
        });
        if (!res.ok) throw new Error(await res.text());
        console.log('   Password Reset Successful.');

        // 11. Login with New Password
        console.log('\n8. Logging in with New Password...');
        res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: TEST_USER.username,
                password: TEST_USER.newPassword
            })
        });
        if (!res.ok) throw new Error(await res.text());

        console.log('   Login Successful with New Password.');
        console.log('\n--- TEST COMPLETED SUCCESSFULLY ---');

    } catch (error) {
        console.error('\n!!! TEST FAILED !!!', error);
    }
};

runTest();
