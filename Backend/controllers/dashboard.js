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
                events: user.events,
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
        const { subject, location, description, startTime, endTime, isAllDay, repeat, customRepeatInterval, timezone } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newEvent = {
            subject,
            location,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            isAllDay,
            repeat,
            customRepeatInterval,
            timezone
        };

        user.events.push(newEvent);
        console.log("New op: ",newEvent);
        await user.save();
        const savedEvent = user.events[user.events.length - 1]; // The newly added event
        console.log(savedEvent)
        res.status(201).json({ message: "Event created successfully", events: savedEvent });
    } catch (e) {
        console.error('Error creating event:', e.message);
        res.status(500).json({ message: 'Error creating event' });
    }
};

exports.UpdateEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const eventId = req.params.eventId;
        const resposn = req.body
        console.log("Req Body: ", resposn)
        const { subject, location, startTime,description, endTime, isAllDay } = req.body;

        // Fetch user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const event = user.events.id(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log('Subject:', subject);
        console.log('Location:', location);
        console.log('IsAllDay:', isAllDay);
        console.log('startTime:', startTime);
        console.log('endTime:', endTime);

        event.startTime = new Date(startTime);
        event.endTime = new Date(endTime);     // Ensure endTime is a valid Date object
        event.subject = subject;
        event.location = location;
        event.isAllDay = isAllDay;
        event.description = description;

        await user.save();

        res.status(200).json(event);
    } catch (e) {
        console.error('Error updating event:', e.message);  // Log the error for debugging
        res.status(500).json({ message: 'Error updating event' });
    }
};


exports.DeleteEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const eventId = req.params.eventId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const event = user.events.id(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        user.events.pull(eventId);

        await user.save();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (e) {
        console.error('Error deleting event:', e);  // Log the entire error object for more details
        res.status(500).json({ message: 'Error deleting event', error: e.message });
    }
};


