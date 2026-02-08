const axios = require('axios');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    username: 'testuser_' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'Password123!',
    newPassword: 'NewPassword456!'
};

let cookie = null;

const getOTP = async (email, type) => {
    const connection = await mysql.createConnection({
        host: process.env.DB_SERVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    const [rows] = await connection.execute(
        'SELECT code FROM verification_codes WHERE email = ? AND type = ?',
        [email, type]
    );
    await connection.end();
    return rows.length > 0 ? rows[0].code : null;
};

const runTest = async () => {
    try {
        console.log('--- STARTING AUTH FLOW TEST ---');
        console.log('Test User:', TEST_USER.username);

        // 1. Initiate Signup
        console.log('\n1. Initiating Signup...');
        await axios.post(`${API_URL}/signup/init`, {
            username: TEST_USER.username,
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        console.log('   Signup Initiated.');

        // 2. Get OTP from DB
        console.log('   Fetching OTP from DB...');
        let otp = await getOTP(TEST_USER.email, 'signup');
        console.log('   OTP found:', otp);

        // 3. Verify Signup
        console.log('\n2. Verifying Signup...');
        await axios.post(`${API_URL}/signup/verify`, {
            username: TEST_USER.username,
            email: TEST_USER.email,
            password: TEST_USER.password,
            otp: otp
        });
        console.log('   Signup Verified & User Created.');

        // 4. Login
        console.log('\n3. Logging In...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            username: TEST_USER.username,
            password: TEST_USER.password
        });
        console.log('   Login Successful. User:', loginRes.data.username);

        // Extract Cookie
        const setCookie = loginRes.headers['set-cookie'];
        if (setCookie) {
            cookie = setCookie[0].split(';')[0];
            console.log('   Cookie received:', cookie);
        } else {
            console.error('   NO COOKIE RECEIVED!');
        }

        // 5. Check Me
        console.log('\n4. Checking Session (/me)...');
        const meRes = await axios.get(`${API_URL}/me`, {
            headers: { Cookie: cookie }
        });
        console.log('   Session Valid. User:', meRes.data.username);

        // 6. Logout
        console.log('\n5. Logging Out...');
        await axios.post(`${API_URL}/logout`, {}, {
            headers: { Cookie: cookie }
        });
        console.log('   Logout Successful.');

        // 7. Verify Logout (Check Me should fail)
        console.log('   Verifying logout...');
        try {
            await axios.get(`${API_URL}/me`, {
                headers: { Cookie: cookie } // Cookie should be invalid/cleared on server side or just rejected
            });
            console.error('   FAILED: Session still valid after logout!');
        } catch (e) {
            console.log('   SUCCESS: Session invalid after logout (Expected 401).');
        }

        // 8. Forgot Password Request
        console.log('\n6. forgot Password Request...');
        await axios.post(`${API_URL}/forgot-password`, {
            identifier: TEST_USER.email
        });
        console.log('   Request Sent.');

        // 9. Get Reset OTP
        console.log('   Fetching Reset OTP from DB...');
        otp = await getOTP(TEST_USER.email, 'reset');
        console.log('   OTP found:', otp);

        // 10. Reset Password
        console.log('\n7. Resetting Password...');
        await axios.post(`${API_URL}/reset-password`, {
            email: TEST_USER.email,
            otp: otp,
            newPassword: TEST_USER.newPassword
        });
        console.log('   Password Reset Successful.');

        // 11. Login with New Password
        console.log('\n8. Logging in with New Password...');
        const newLoginRes = await axios.post(`${API_URL}/login`, {
            username: TEST_USER.username,
            password: TEST_USER.newPassword
        });
        console.log('   Login Successful with New Password.');

        console.log('\n--- TEST COMPLETED SUCCESSFULLY ---');

    } catch (error) {
        console.error('\n!!! TEST FAILED !!!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error);
        }
    }
};

runTest();
