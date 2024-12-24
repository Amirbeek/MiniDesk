import React, { useEffect, useState } from "react";
import axios from "axios";
import TestCalendar from "../components/ButtonCalendar";
import "tui-calendar/dist/tui-calendar.css";
import "../style/MyCalendar.css";
import {registerLicense} from "@syncfusion/ej2-base";

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
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1ccnRQQ2NdVkxzWUA=')


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
        dataSource:
            Array.isArray(EventData) && EventData.length > 0
                ? EventData.map((event) => ({
                    Id: event._id, // Ensure _id is included
                    Subject: event.subject,
                    Description: event.description,
                    Timezone: event.timezone,
                    RepeatInterval: event.customRepeatInterval,
                    Location: event.location,
                    StartTime: new Date(event.startTime),
                    EndTime: new Date(event.endTime),
                    IsAllDay: event.isAllDay,
                }))
                : [],
        fields: {
            subject: { name: "Subject", defaultValue: "No Title" },
            startTime: { name: "StartTime", defaultValue: new Date() },
            endTime: { name: "EndTime", defaultValue: new Date() },
        },
    };

    const API_URL = "http://localhost:5000/api/event";

    const addEvent = async (event) => {
        try {
            const token = localStorage.getItem("authToken");
            console.log("dsgsdg, ",event)
            const response = await axios.post(
                API_URL,
                {
                    subject: event.subject,
                    description:event.description,
                    location: event.location,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    isAllDay: event.isAllDay,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setEventData((prevState) => [
                    ...prevState,
                    {
                        _id: response.data.eventId,
                        subject: event.subject,
                        description: event.description,
                        location: event.location,
                        startTime: event.startTime,
                        endTime: event.endTime,
                        isAllDay: event.isAllDay,
                    },
                ]);
            console.log("Event added:", event);
        } catch (error) {
            console.error("Error adding event:", error.response?.data || error.message);
        }
    };

    const updateEvent = async (event) => {
        try {
            const token = localStorage.getItem("authToken");
            console.log("Event updated:", event.id);
            await axios.put(
                `${API_URL}/${event.id}`,
                {
                    subject: event.subject,
                    description: event.description,
                    location: event.location,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    isAllDay: event.isAllDay,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setEventData((prevState) =>
                prevState.map((item) =>
                    item._id === event.id
                        ? { ...item, ...event }
                        : item
                )
            );
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
            setEventData((prevState) => prevState.filter(event => event._id !== eventId));

            console.log("Event deleted:", eventId);
        } catch (error) {
            console.error("Error deleting event:", error.response?.data || error.message);
        }
    };

    const handleActionBegin = (args) => {
        if (args.requestType === "eventCreate") {
            const newEvent = args.data[0];
            const startTime = newEvent.StartTime.toISOString();
            const endTime = newEvent.EndTime.toISOString();

            console.log('Payload being sent:', {
                subject: newEvent.Subject,
                location: newEvent.Location,
                startTime,
                endTime,
                isAllDay: newEvent.IsAllDay,
            });

            addEvent({
                subject: newEvent.Subject,
                location: newEvent.Location,
                description:newEvent.Description,
                startTime,
                endTime,
                isAllDay: newEvent.IsAllDay,
            });
        } else if (args.requestType === "eventChange") {
            console.log(args.data);
            const updatedEvent = {
                id: args.data.Id,
                subject: args.data.Subject,
                location: args.data.Location,
                description: args.data.Description,
                startTime: args.data.StartTime.toISOString(), // Ensure it's an ISO string
                endTime: args.data.EndTime.toISOString(), // Ensure it's an ISO string
                isAllDay: args.data.IsAllDay,
            };

            console.log('Updated event payload being sent:', updatedEvent);

            // Sending updated event
            updateEvent(updatedEvent);
        } else if (args.requestType === "eventRemove") {
            // Ensure args.data is not empty or undefined before trying to access the event ID
            if (Array.isArray(args.data) && args.data.length > 0) {
                const deletedEventId = args.data[0].Id; // Access the event ID
                if (deletedEventId) {
                    console.log('Event to delete:', deletedEventId);
                    deleteEvent(deletedEventId);
                } else {
                    console.error("Event ID is missing");
                }
            } else {
                console.error("No event data to remove");
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
                    cursor: "pointer",
                    backgroundColor:'transparent',
                    padding:0,
                    marginTop:15
                }}
            >
                <TestCalendar date={EventData}/>
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
