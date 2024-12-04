import React, { useState } from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from "@syncfusion/ej2-react-schedule";
import "tui-calendar/dist/tui-calendar.css";
import "../style/MyCalendar.css";

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
};

function Callendarr() {
    const [open, setOpen] = useState(false);

    // Mock event data
    const eventData = [
        {
            Id: 1,
            Subject: "Meeting",
            Location: "Conference Room",
            StartTime: new Date(2024, 11, 5, 10, 0),
            EndTime: new Date(2024, 11, 5, 11, 0),
            IsAllDay: false,
        },
        {
            Id: 2,
            Subject: "Team Lunch",
            Location: "Cafeteria",
            StartTime: new Date(2024, 11, 6, 12, 30),
            EndTime: new Date(2024, 11, 6, 13, 30),
            IsAllDay: false,
        },
    ];

    // Modal open/close handlers
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <button onClick={handleOpen} style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Open Calendar
            </button>
            {open && (
                <div style={ModalBackground}>
                    <div style={ModalContent}>
                        <div style={Header}>
                            <h3>My Calendar</h3>
                            <button style={CloseButton} onClick={handleClose}>X</button>
                        </div>
                        <ScheduleComponent
                            width="100%"
                            height="100vh"
                            currentView="Month"
                            eventSettings={{ dataSource: eventData }}
                        >
                            <ViewsDirective>
                                <ViewDirective option="Day" />
                                <ViewDirective option="Week" />
                                <ViewDirective option="WorkWeek" />
                                <ViewDirective option="Month" isSelected={true} />
                                <ViewDirective option="Agenda" />
                            </ViewsDirective>
                            <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
                        </ScheduleComponent>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Callendarr;
