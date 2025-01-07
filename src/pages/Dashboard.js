import React, { useContext, useEffect, useState } from 'react';
import Calendar from "../dashboard-sections/Calendar";
import NewNavbar from "../components/NewNavbar";
import styled from "styled-components";
import { Grid } from "@mui/material";
import useApi from "../useApi";
import Todo from "../dashboard-sections/Todo";
import Note from "../dashboard-sections/Note";
import ScrollBox from "../components/ScrollBox";
import { EditHomePageContext } from "../components/EditHomePage";
import EditBackgroundImage from "../components/EditBackgroundImage";

const BackImage = styled.div`
    background: ${(props) => `url("${props.imageUrl}") no-repeat center center`};
    background-size: cover;
    min-height: 100vh;
    position: relative;
    background-color: ${(props) => (props.editMode ? 'red' : '#000')};
    overflow: hidden;
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${(props) => (props.editMode ? 'rgba(0, 0, 0, 0.7)' : 'transparent')};
        z-index: 1;
    }
    > * {
        z-index: 2;
    }
`;


const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const { editMode, setEditMode } = useContext(EditHomePageContext);
    const apiCall = useApi();
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiCall({
                    endpoint: 'dashboard',
                    method: 'GET',
                });
                setUserData(data.user);
                console.log('dashboard data', data.user);

            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
                if (error.message.includes('Unauthorized')) {
                    window.location.href = '/login';
                }
            }
        };
        fetchData();
    }, [apiCall]);

    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            setEditMode(false);
        }
    };
    const handleGridClick = (event) => {
        if (event.target === event.currentTarget) {
            setEditMode(false);
        }
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <BackImage
                editMode={editMode}
                onClick={handleBackgroundClick}
                imageUrl={userData?.backgroundImage }
            >
                {userData ? (
                    <div style={{ position: 'relative' }}  >
                        <NewNavbar UserInfo={userData} setUserInfo={setUserData} handleOpen={handleOpen}/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={8 } onClick={handleGridClick} >
                                <ScrollBox editMode={editMode} marks={userData['marks']}/>
                            </Grid>
                            <Grid item xs={12} sm={8} md={4} sx={{ padding: 5 }} onClick={handleGridClick}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} onClick={handleGridClick}>
                                        <Todo todosData={userData['todos']} onChangeMode={setEditMode} />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <Note notesData={userData['notes']} onChangeMode={setEditMode} />
                                    </Grid>
                                </Grid>
                                <Calendar EventData={userData['events']} onChangeMode={setEditMode} />
                            </Grid>
                        </Grid>
                    </div>
                ) : <span>Loading...</span>}
            </BackImage>
            <EditBackgroundImage open={open} setOpen={setOpen} handleClose={handleClose} UserInfo={userData} setUserInfo={setUserData} />
        </div>
    );
};

export default Dashboard;
