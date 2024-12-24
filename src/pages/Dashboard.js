import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from "../dashboard-sections/Calendar";
import NewNavbar from "../components/NewNavbar";
import styled from "styled-components";
import { Grid } from "@mui/material";
import Todo from "../dashboard-sections/Todo";
import Note from "../dashboard-sections/Note";
import ScrollBox from "../components/ScrollBox";
import HorizontalScrollBox from "../components/ScrollBox";
import Test from "../components/NoteEditor";
import NotesWindow from "../components/NotesWindow";

const BackImage = styled.div`
    background: url("https://w0.peakpx.com/wallpaper/236/488/HD-wallpaper-mac-os-ventura-dark-macos-ventura-macbook-apple-computer.jpg") no-repeat center center;
    background-size: cover;
    min-height: 100vh;
`;

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);

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
                setUserData(response.data.user);
                console.log(response)
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <BackImage>
            {userData ? (
                <>
                    <NewNavbar UserInfo={userData} setEditMode={setEditMode} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4} md={8}>
                        </Grid>
                        <Grid item xs={12} sm={8} md={4} sx={{padding:5}}>
                            <Grid container spacing={2} >
                                <Grid item xs={6}>
                                    <Todo />
                                </Grid>
                                <Grid  item xs={6}>
                                    <Note  notesData={userData['notes']} />
                                </Grid>
                            </Grid>
                            <Calendar EventData={userData['events']} />
                        </Grid>
                        {/*<NotesWindow/>*/}
                    </Grid>

                    {/*<HorizontalScrollBox/>*/}
                </>
            ) : (
                <span>Loading...</span>
            )}
        </BackImage>
    );
};

export default Dashboard;
