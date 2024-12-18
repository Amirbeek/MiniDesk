const User = require('../models/User');
const Event = require('../models/Event');
exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('events');
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
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};



exports.postEvent = async (req, res) => {
    const userId = req.user.userId; // Assuming `userId` is available from authentication middleware
    const { subject, location, description, startTime, endTime, isAllDay, repeat, customRepeatInterval, timezone } = req.body;

    const event = new Event({
        subject,
        location,
        description,
        startTime,
        endTime,
        isAllDay,
        repeat,
        customRepeatInterval,
        timezone,
        creator: userId
    });

    try {
        await event.save();
        const user = await User.findById(userId);
        user.events.push(event);
        await user.save();

        res.status(201).json({
            message: "Event created successfully",
            eventId: event._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating event", error: err });
    }
};
exports.UpdateEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const eventId = req.params.eventId;

        const { subject, location, startTime, endTime, isAllDay, description } = req.body;

        // Find the event directly
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is the creator
        if (event.creator.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized!' });
        }

        // Validate input
        if (!subject || !location || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Update event details
        event.subject = subject;
        event.location = location;
        event.startTime = new Date(startTime);
        event.endTime = new Date(endTime);
        event.isAllDay = isAllDay;
        event.description = description;

        // Save updated event
        await event.save();

        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (e) {
        console.error('Error updating event:', e);
        res.status(500).json({ message: 'Error updating event', error: e.message });
    }
};



exports.DeleteEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId).populate('creator');

        if (!event) {
            const error = new Error('Could not find event.');
            error.statusCode = 404;
            throw error;
        }
        if (event.creator._id.toString() !== userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }

        // Remove event reference from user
        const user = await User.findById(userId);
        user.events.pull(eventId);
        await user.save();

        // Delete the event
        await Event.findByIdAndDelete(eventId);

        res.status(200).json({ message: 'Event deleted successfully', eventId });
    } catch (e) {
        console.error('Error deleting event:', e);
        res.status(e.statusCode || 500).json({ message: e.message || 'Error deleting event' });
    }
};


