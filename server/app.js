const express = require('express');
const cors = require('cors');
require('dotenv').config();

const leetcodeRouter = require('./routes/leetcode');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Routes
app.use('/api/leetcode', leetcodeRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// Error Handling Middleware
app.use(require('./middleware/errorHandler'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});