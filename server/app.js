const express = require('express');
const cors = require('cors');
require('dotenv').config();

const leetcodeRouter = require('./routes/leetcode');
const userUpdationRouter = require('./routes/userUpdation');
const userDataRouter = require('./routes/userData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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