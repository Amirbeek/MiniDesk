import React, { useEffect, useState } from "react";
import axios from "axios"; // For making API calls

import "tui-calendar/dist/tui-calendar.css";
import "../style/MyCalendar.css";
import {
    ScheduleComponent,
    Day,
    Week,
    WorkWeek,
    Month,
    Agenda,
    Inject,
    ViewsDirective,
    ViewDirective,
    DragAndDrop,
    Resize,
} from "@syncfusion/ej2-react-schedule";

// Styled components for the modal
const ModalBackground = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const ModalContent = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "900px",
    maxHeight: "80%",
    overflowY: "auto",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const Header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #000",
    paddingBottom: "10px",
    marginBottom: "10px",
};

const CloseButton = {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "20px",
    cursor: "pointer",
    color: "black",
};

const   MyCalendar = () => {
    const [open, setOpen] = useState(false);
    const [EventData, setEventData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (Array.isArray(response.data.user.events)) {
                    setEventData(response.data.user.events);
                } else {
                    setEventData([]);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
                setEventData([]);
            }
        };

        fetchData();
    }, []);

    const localData = {
        dataSource: Array.isArray(EventData) && EventData.length > 0
            ? EventData.map((event) => ({
                Id: event._id,
                Subject: event.subject,
                Description: event.description,
                Timezone: event.timezone,
                RepeatInterval: event.customRepeatInterval,
                Location: event.location,
                StartTime: new Date(event.startTime),
                EndTime: new Date(event.endTime),
                IsAllDay: event.isAllDay,
                Color: event.color,
                Status: event.status,
                EndCondition: event.endCondition,  // Adding endCondition
                EndDate: event.endDate,  // Adding endDate
                Occurrences: event.occurrences,  // Adding occurrences
            }))
            : [],
        fields: {
            subject: { name: "Subject", defaultValue: "No Title" },
            startTime: { name: "StartTime", defaultValue: new Date() },
            endTime: { name: "EndTime", defaultValue: new Date() },
            // Include other fields as necessary, such as color, status, etc.
        },
    };

    const API_URL = "http://localhost:5000/api/event";

    const addEvent = async (event) => {
        try {
            const token = localStorage.getItem("authToken");

            const response = await axios.post(
                API_URL,
                {
                    subject: event.subject,
                    description: event.description || "",
                    location: event.location || "Not provided",
                    startTime: event.startTime,
                    endTime: event.endTime,
                    isAllDay: event.isAllDay || false,
                    repeat: event.repeat || "none",
                    customRepeatInterval: event.customRepeatInterval || null,
                    timezone: event.timezone || "UTC",
                    color: event.color || "#FFFFFF",
                    status: event.status || "active",
                    endCondition: event.endCondition || "none",  // Adding endCondition
                    endDate: event.endDate || null,  // Adding endDate
                    occurrences: event.occurrences || null,  // Adding occurrences
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("Event added:", response.data);
        } catch (error) {
            console.error("Error adding event:", error.response?.data || error.message);
        }
    };

    const updateEvent = async (event) => {
        try {
            const token = localStorage.getItem("authToken");

            const response = await axios.put(
                `${API_URL}/${event.id}`,
                {
                    subject: event.subject,
                    description: event.description || "",
                    location: event.location || "Not provided",
                    startTime: event.startTime,
                    endTime: event.endTime,
                    isAllDay: event.isAllDay || false,
                    repeat: event.repeat || "none",
                    customRepeatInterval: event.customRepeatInterval || null,
                    timezone: event.timezone || "UTC",
                    color: event.color || "#FFFFFF",
                    status: event.status || "active",
                    endCondition: event.endCondition || "none",
                    endDate: event.endDate || null,
                    occurrences: event.occurrences || null,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("Event updated:", response.data);
        } catch (error) {
            console.error("Error updating event:", error.response?.data || error.message);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`${API_URL}/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Event deleted:", eventId);
        } catch (error) {
            console.error("Error deleting event:", error.response?.data || error.message);
        }
    };

    const handleActionBegin = (args) => {
        console.log(args.data)

        const payload = {
            subject: args.data.subject || "No Title",
            location: args.data.Location || "Not provided",
            description: args.data.Description || "",
            timezone: args.data.StartTimezone || "UTC",
            startTime: new Date(args.data.StartTime).toISOString(),
            endTime: new Date(args.data.EndTime).toISOString(),
            isAllDay: args.data.IsAllDay || false,
            repeat: args.data.RepeatInterval || "none",
            customRepeatInterval: args.data.CustomRepeatInterval || null,
            color: args.data.Color || "#FFFFFF",
            status: args.data.Status || "active",
            endCondition: args.data.EndCondition || "none",  // Include endCondition
            endDate: args.data.EndDate || null,  // Include endDate
            occurrences: args.data.Occurrences || null,  // Include occurrences
        };

        if (args.requestType === "eventCreate") {
            console.log('Creating new event:', payload);
            addEvent(payload);
        } else if (args.requestType === "eventChange") {
            console.log('Updating event:', payload);
            updateEvent({ id: args.data.Id, ...payload });
        } else if (args.requestType === "eventRemove") {
            const deletedEventId = args.data.length > 0 ? args.data[0].Id : null;
            if (deletedEventId) {
                console.log('Deleting event:', deletedEventId);
                deleteEvent(deletedEventId);
            }
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <button
                onClick={handleOpen}
                style={{
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Open Calendar
            </button>

            {/* Custom Modal */}
            {open && (
                <div style={ModalBackground}>
                    <div style={ModalContent}>
                        <div style={Header}>
                            <h3>My Calendar</h3>
                            <button style={CloseButton} onClick={handleClose}>
                                X
                            </button>
                        </div>

                        <ScheduleComponent
                            width="100%"
                            height="600px"
                            currentView="Month"
                            eventSettings={localData}
                            allowDragAndDrop={true}
                            allowResize={true}
                            actionBegin={handleActionBegin}
                        >
                            <ViewsDirective>
                                <ViewDirective option="Day" />
                                <ViewDirective option="Week" />
                                <ViewDirective option="WorkWeek" showWeekNumber={true} />
                                <ViewDirective option="Month" isSelected={true} />
                                <ViewDirective option="Agenda" />
                            </ViewsDirective>
                            <Inject
                                services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]}
                            />
                        </ScheduleComponent>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCalendar;


model:const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const eventSchema = new mongoose.Schema({
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
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'none'
    },
    repeatInterval: {
        type: Number,
        default: 1
    },
    repeatOn: {
        type: [String],
        default: []
    },
    endCondition: {
        type: String,
        enum: ['never', 'afterX', 'onDate'],
        default: 'never'
    },
    occurrences: {
        type: Number,
        default: 1
    },
    endDate: {
        type: Date,
        default: null
    },
    timezone: {
        type: String,
        default: "UTC"
    },
    color: {
        type: String,
        default: "#FFFFFF"
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    },
});




const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, minlength: 3 },
        email: { type: String, required: true, unique: true, lowercase: true, match: /.+\@.+\..+/ },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        country: { type: String, default: null },
        password: { type: String, required: true, minlength: 8 },
        isActive: { type: Boolean, default: false },
        activationToken: { type: String, default: null },
        resetPasswordToken: { type: String, default: null },
        events: [eventSchema],
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.activationToken;
        return ret;
    }
});

module.exports = mongoose.model('User', UserSchema);

