const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    subject: {
        type: String,
        required: true,
        default: "No Title"
    },
    location: {
        type: String,
        default: "Not provided"
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    isAllDay: {
        type: Boolean,
        default: false
    },
    repeat: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom'],
        default: 'none'
    },
    customRepeatInterval: {
        type: Number,
        default: null
    },
    timezone: {
        type: String,
        default: "UTC"
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
