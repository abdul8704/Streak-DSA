const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify token
        // Use a secure secret in production. For now, using a fallback or env.
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        req.user = decoded; // Attach user to request
        next();
    } catch (error) {
        console.error('Initial token verification failed:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = {
    verifyToken
};
