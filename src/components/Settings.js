import React, { useState } from 'react';
import { Modal, Box, Button, Grid } from '@mui/material';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import useApi from "../useApi";
import DialogHeader from "./widget_component/DialogHeader";

const AccountSettingStyle = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 0 40px 40px 40px ;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    width: 400px;
    overflow: hidden;
`;

const Divider = styled.div`
    height: 1px;
    background-color: #e0e0e0;
    margin: 16px 0;
`;

const LogoutButton = styled(Button)`
    text-transform: none;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 8px;
    background-color: #d32f2f!important;
    color: #fff;
    margin-top: 10px;

    &:hover {
        background-color: #c33b3b;
        box-shadow: 0px 4px 10px rgba(25, 118, 210, 0.2);
    }
`;

const DeleteButton = styled(Button)`
    text-transform: none;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid #d32f2f;
    color: #d32f2f;
    margin-top: 10px;
    &:hover {
        background-color: #f8d7da;
        box-shadow: 0px 4px 10px rgba(211, 47, 47, 0.2);
    }
`;

const Settings = ({ UserInfo }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const apiCall = useApi();

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
        try {
            await apiCall({
                method: "DELETE",
                endpoint: 'auth/delete',
            });
            localStorage.removeItem('authToken');
            navigate('/login');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <MenuItem onClick={handleOpen} style={{ fontSize: '16px', fontWeight: '500' }}>
                Account
            </MenuItem>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="user-info-modal"
                aria-describedby="user-info-description"
            >
                <AccountSettingStyle>
                    <DialogHeader title="Account Settings" onClose={handleClose} />
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={4}><strong>Username:</strong></Grid>
                        <Grid item xs={6}>{UserInfo.username}</Grid>
                        <Grid item xs={4}><strong>Email:</strong></Grid>
                        <Grid item xs={6}>{UserInfo.email}</Grid>
                        <Grid item xs={4}><strong>Name:</strong></Grid>
                        <Grid item xs={6}>{UserInfo.name}</Grid>
                        <Grid item xs={4}><strong>Surname:</strong></Grid>
                        <Grid item xs={6}>{UserInfo.surname}</Grid>
                        <Grid item xs={4}><strong>Country:</strong></Grid>
                        <Grid item xs={6}>{UserInfo.country}</Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{marginTop:4}}>
                        <Grid item xs={6}>
                            <LogoutButton
                            variant="contained"
                            onClick={handleLogout}
                            fullWidth
                            >
                                Log Out
                            </LogoutButton>
                        </Grid>

                        <Grid item xs={6}>
                            <DeleteButton
                                variant="outlined"
                                color="error"
                                onClick={deleteUser}
                                fullWidth
                            >
                                Delete Account
                            </DeleteButton>
                        </Grid>

                    </Grid>
                </AccountSettingStyle>
            </Modal>
        </>
    );
};

export default Settings;
//
