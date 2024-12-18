import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import {Grid} from "@mui/material";
const BackImage = styled.div`
    background: url("https://w0.peakpx.com/wallpaper/236/488/HD-wallpaper-mac-os-ventura-dark-macos-ventura-macbook-apple-computer.jpg") no-repeat center center;
    background-size: cover;
    min-height: 100vh;
`;

const Dashboard = () => {
    const [userData, setUserData] = useState(null);

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
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div>
            {userData ? (
                <BackImage>
                    <Navbar UserInfo={userData}/>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>

                        </Grid>
                        <Grid item xs={3}>
                            <Calendar EventData={userData['events']} />
                        </Grid>
                    </Grid>
                </BackImage>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    );

};

export default Dashboard;
