import React, { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import "tui-calendar/dist/tui-calendar.css";
import "../style/MyCalendar.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #000;
    padding-bottom: 10px;
    margin-bottom: 10px;
`;

const SettingButton = styled.a`
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    width: 100%;
    height: 100%;
    padding: 17px 10px 8px 10px;
    border-radius: 8px;
`
const Settings = ({ UserInfo }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
        console.log("User logged out");
    };
    const deleteUser = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.delete('http://localhost:5000/api/auth/delete', {
                headers: { Authorization: `Bearer ${token}` },
            })
            localStorage.removeItem('authToken');
            navigate('/login');
        }catch (e) {
            console.log(e)
        }
    }
    return (
        <div>
            {/* Button to open the modal */}
            <SettingButton  onClick={handleOpen}>
                <SettingsOutlinedIcon/>
            </SettingButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="user-info-modal"
                aria-describedby="user-info-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Header>
                        <Typography variant="h6" component="h2">
                            Account Settings
                        </Typography>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClose}
                        >
                            X
                        </Button>
                    </Header>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Username:</strong> {UserInfo.username}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        <strong>Email:</strong> {UserInfo.email}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        <strong>Name:</strong> {UserInfo.name}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        <strong>Surname:</strong> {UserInfo.surname}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        <strong>Country:</strong> {UserInfo.country}
                    </Typography>

                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2 }}
                        onClick={handleLogout}
                        fullWidth={true}
                    >
                        Log Out
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ mt: 2 }}
                        onClick={deleteUser}
                        fullWidth={true}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Settings;
