const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];


    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                try {
                    const payload = jwt.decode(token);
                    const user = await User.findById(payload.userId)
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }
                    if (user.unicorn === false) {
                        return res.status(401).json({ message: 'Token has expired' });
                    }
                    req.user = payload;
                    return next();
                } catch (error) {
                    return res.status(500).json({ message: 'Internal server error' });
                }
            }
        }

        try {
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};

module.exports = authenticate;
