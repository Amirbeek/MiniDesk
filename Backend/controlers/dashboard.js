const User = require('../models/User');

exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'Welcome to your dashboard',
            user: {
                username: user.username,
                email: user.email,
                name: user.name,
                surname: user.surname,
                country: user.country,
                events:user.events,
            },
        });
    } catch (err) {
        console.error('Error fetching user info:', err.message);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};

exports.postEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, description, startTime, endTime, allDay, location } = req.body;
        if (!title || !startTime || !endTime) {
            return res.status(400).json({ message: "Title, startTime, and endTime are required." });
        }
        const newEvent = { title, description, startTime, endTime, allDay, location };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { events: newEvent } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(201).json({ message: "Event created successfully", events: user.events });


    }catch (e) {
        res.status(500).json({ message: 'Error fetching user info' });
    }
}

