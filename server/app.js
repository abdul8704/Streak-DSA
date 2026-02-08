const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const leetcodeRouter = require('./routes/leetcode');
const userUpdationRouter = require('./routes/userUpdation');
const userDataRouter = require('./routes/userData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/leetcode', leetcodeRouter);
app.use('/api/user', userUpdationRouter);
app.use('/api/user-data', userDataRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// Error Handling Middleware
app.use(require('./middleware/errorHandler'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});