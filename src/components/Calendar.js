import React, { useEffect, useRef } from "react";
import Calendar from "tui-calendar";
import "tui-calendar/dist/tui-calendar.css";
import "../style/MyCalendar.css"; // Optional for styling

const MyCalendar = () => {
    const calendarRef = useRef(null);
    let calendarInstance = null;

    useEffect(() => {
        calendarInstance = new Calendar(calendarRef.current, {
            defaultView: "day", // Initial view: "month", "week", "day"
            taskView: true,
            scheduleView: true,
            useCreationPopup: true,
            useDetailPopup: true,
        });

        // Example: Add some sample schedules
        calendarInstance.createSchedules([
            {
                id: "1",
                calendarId: "1",
                title: "Meeting with Team",
                category: "time",
                start: "2024-12-03T10:00:00",
                end: "2024-12-03T12:30:00",
            },
        ]);

        return () => calendarInstance.destroy();
    }, []);

    const handleViewChange = (view) => {
        calendarInstance.changeView(view); // Change calendar view
    };

    const handleToday = () => {
        calendarInstance.today(); // Navigate to today
    };

    const handleNavigate = (days) => {
        const currentDate = calendarInstance.getDate();
        calendarInstance.setDate(currentDate.addDays(days)); // Navigate by days
    };

    const handleViewAllEvents = () => {
        const schedules = calendarInstance.getSchedules();
        console.log("All Events:", schedules);
        alert("Check the console for all events!");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-around", padding: "10px", backgroundColor: "#f4f4f4", borderBottom: "1px solid #ccc" }}>
                <button onClick={() => handleViewChange("month")}>Month</button>
                <button onClick={() => handleViewChange("week")}>Week</button>
                <button onClick={() => handleViewChange("day")}>Day</button>
                <button onClick={handleToday}>Today</button>
                <button onClick={() => handleNavigate(-1)}>Yesterday</button>
                <button onClick={() => handleNavigate(1)}>Tomorrow</button>
                <button onClick={handleViewAllEvents}>View All Events</button>
            </div>

            {/* Calendar */}
            <div ref={calendarRef} style={{ flex: 1, height: "100%" }} />
        </div>
    );
};

export default MyCalendar;
