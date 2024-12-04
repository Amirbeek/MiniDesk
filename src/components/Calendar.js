import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
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
    ViewDirective,
    ViewsDirective,
    DragAndDrop,
    Resize
} from "@syncfusion/ej2-react-schedule";

const MyCalendar = () => {
    const [open, setOpen] = useState(false);

    const localData = {
        dataSource: [
            {
                Id: 1,
                Subject: "Meeting",
                Location: "Student Center",
                StartTime: new Date(2024, 11, 4, 10, 0),
                EndTime: new Date(2024, 11, 4, 11, 0),
                IsAllDay: false,
            },
            {
                Id: 2,
                Subject: "Team Outing",
                StartTime: new Date(2024, 11, 5, 12, 0),
                EndTime: new Date(2024, 11, 5, 14, 0),
                IsAllDay: false,
            },
        ],
        fields: {
            subject: { name: "Subject", defaultValue: "No Title" },
            startTime: { name: "StartTime", defaultValue: new Date() },
            endTime: { name: "EndTime", defaultValue: new Date() },
        },
    };

    const onDragStart = (args) => {
        if (args.scroll) {
            args.scroll.enable = true;
        }
    };

    const onResize = (args) => {
        if (args.scroll) {
            args.scroll.enable = true;
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            {/* Button to open the calendar modal */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Open Calendar
            </Button>

            {/* Modal */}
            <Modal open={open} onClose={handleClose} aria-labelledby="calendar-modal" aria-describedby="calendar-modal-description">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxHeight: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {/* Calendar inside the modal */}
                    <ScheduleComponent
                        width="100%"
                        height="600px"
                        currentView="Month"
                        eventSettings={localData}
                        allowDragAndDrop={true}
                        allowResize={true}
                        dragStart={onDragStart}
                        resize={onResize}
                    >
                        <ViewsDirective>
                            <ViewDirective option="Day" />
                            <ViewDirective option="Week" />
                            <ViewDirective option="WorkWeek" showWeekNumber={true} />
                            <ViewDirective option="Month" isSelected={true} />
                            <ViewDirective option="Agenda" />
                        </ViewsDirective>
                        <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]} />
                    </ScheduleComponent>
                </Box>
            </Modal>
        </div>
    );
};

export default MyCalendar;
