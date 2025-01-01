import React, { useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { Grid } from '@mui/material';

const CalendarWrapper = styled.div`
    margin-top: 2rem;
    display: flex;
    justify-content: center;
`;

const CalendarContainer = styled.div`
    width: 100%;
    background-color: rgba(0, 0, 0, .4);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 15px; 
    display: flex;
    flex-direction: column;
`;

const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
`;

const CalendarTitle = styled.h2`
    font-size: 20px;  
    font-weight: 600;
    color: #f1f1f1;
`;

const CalendarContent = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px; 
`;

const WeekDays = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 14px;  
    margin-bottom: 8px; 

    & > * {
        margin: 0 10px;
    }
`;

const DayCell = styled.div`
    width: 14.28%;
    padding: 3px 0;  
    text-align: center;
    font-size: 14px;  
    cursor: pointer;
    transition: all 0.3s ease;

    &.today {
        background-color: red;
        color: white;
        border-radius: 50%;
        font-weight: bold;
    }


    &:not(.today) {
        color: #fff;
    }
`;

const CalendarSidebar = styled.div`
    padding: 5px;
    border-radius: 8px;
    font-size: 14px; // Reduced font size
    text-align: center;
    margin-top: 2.5rem;

    small {
        font-weight: bold;
        color: #aa8484;
    }

`;

const DateInfo = styled.p`
    font-weight: bold;
    color: #f1f1f1;
    margin: 0;
`;

const CalendarWidget = ({ date }) => {
    const today = dayjs();
    const [currentMonth, setCurrentMonth] = useState(today);
    const currentDate = today.format('dddd, MMMM D, YYYY');

    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const firstDayOfMonth = currentMonth.startOf('month').day();
    const daysInMonth = currentMonth.daysInMonth();

    const emptyDays = Array(firstDayOfMonth).fill(null);
    const daysArray = [...emptyDays, ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

    const getEventCountForDay = (day) => {
        if (!date || !Array.isArray(date)) return 0;
        const eventsOnDay = date.filter(event => {
            const eventDate = dayjs(event.startTime);
            return eventDate.isSame(currentMonth.date(day), 'day');
        });
        return eventsOnDay.length;
    };
    const eventsToday = getEventCountForDay(today.date());

    return (
        <CalendarWrapper>
            <CalendarContainer>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <CalendarHeader>
                            <CalendarTitle>Calendar</CalendarTitle>
                        </CalendarHeader>
                        <CalendarContent>
                            <WeekDays>
                                {daysOfWeek.map((day, index) => (
                                    <div key={index}>{day}</div>
                                ))}
                            </WeekDays>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {daysArray.map((day, index) => (
                                   <>
                                       <DayCell
                                           key={index}
                                           className={`
                                            ${day === today.date() ? 'today' : ''}
                                        `}
                                       >
                                           {day || ''}
                                       </DayCell>
                                   </>

                                ))}
                            </div>
                        </CalendarContent>
                    </Grid>
                    <Grid item xs={4} >
                        <CalendarSidebar>
                            <DateInfo>{currentDate}</DateInfo>
                            <small>{eventsToday > 0 ? `${eventsToday} event(s) today` : 'No more events today'}</small>
                        </CalendarSidebar>
                    </Grid>
                </Grid>
            </CalendarContainer>
        </CalendarWrapper>
    );
};

export default CalendarWidget;
