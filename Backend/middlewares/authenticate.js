const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header is missing' });
    const token = authHeader.split(' ')[1]; // Assuming "Bearer <token>"

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: 'Invalid or expired token' });
        console.log(user)
        req.user = user;
        next();
    });
};

module.exports = authenticate;
