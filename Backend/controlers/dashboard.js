const User = require('../models/User');

exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming JWT stores userId as `userId`

        // Fetch user from the database
        const user = await User.findById(userId);

        // Handle case where the user is not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user's details
        res.status(200).json({
            message: 'Welcome to your dashboard',
            user: {
                username: user.username,
                email: user.email,
                name: user.name,
                surname: user.surname,
                country: user.country,
            },
        });
    } catch (err) {
        console.error('Error fetching user info:', err.message);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};
