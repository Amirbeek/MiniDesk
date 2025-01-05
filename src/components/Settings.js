import React, { useState } from "react";
import {
    Modal,
    Box,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useApi from "../useApi";
import DialogHeader from "./widget_component/DialogHeader";

const AccountSettingStyle = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 400px;
    overflow: hidden;
    padding: 0 40px 40px 40px;
`;

const Divider = styled.div`
    height: 1px;
    background-color: #e0e0e0;
    margin: 16px 0;
`;

const SaveButton = styled.button`
    background-color: #28a745;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 20px;
    width: 100%;
    border-radius: 8px;
    text-transform: none;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #218838; 
    }

    &:active {
        background-color: #1e7e34; 
    }

    &:disabled {
        background-color: #c3e6cb; 
        color: #6c757d;
        cursor: not-allowed;
        box-shadow: none;
    }
`;


const LogoutButton = styled.button`
    background-color: #d32f2f; /* Material Design error red */
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    width: 100%;
    padding: 10px 20px;
    border-radius: 8px;
    text-transform: none;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #c62828; 
    }

    &:active {
        background-color: #b71c1c; 
    }

    &:disabled {
        background-color: #f8d7da; 
        color: #721c24;
        cursor: not-allowed;
        box-shadow: none;
    }
`;

const DeleteButton = styled.button`
    border: 1px solid #d32f2f;
    color: #d32f2f; 
    font-weight: 600;
    font-size: 14px;
    width: 100%;
    padding: 10px 20px;
    border-radius: 8px;
    text-transform: none;
    background-color: transparent;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #f8d7da; 
        color: #b71c1c;
    }

    &:active {
        background-color: #f5c6cb; 
    }

    &:disabled {
        border-color: #f5c6cb;
        color: #6c757d;
        cursor: not-allowed;
        box-shadow: none;
    }
`;



const Settings = ({ UserInfo }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [unicorn, setUnicorn] = useState(UserInfo.unicorn);
    const [country, setCountry] = useState(UserInfo.country);
    const apiCall = useApi();
    const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France','UZB'];

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    const handleDelete = async () => {
        try {
            await apiCall({
                method: "DELETE",
                endpoint: "auth/delete",
                body: { unicorn },
            });
            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (e) {
            console.error("Delete account failed", e);
        }
    };

    const handleChanges = async () => {
        try {
            await apiCall({
                method: "PUT",
                endpoint: "settings",
                body: { unicorn, country },
            });
            setOpen(false);
        } catch (e) {
            console.error("Save settings failed", e);
        }
    };

    return (
        <>
            <MenuItem onClick={handleOpen}>Account</MenuItem>
            <Modal open={open} onClose={handleClose}>
                <AccountSettingStyle>
                    <DialogHeader title="Account Settings" onClose={handleClose} />
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={4} sx={{ py: 5 }}>
                            <strong>Username:</strong>
                        </Grid>
                        <Grid item xs={8} sx={{ py: 5 }}>
                            {UserInfo.username}
                        </Grid>

                        <Grid item xs={4} sx={{ py: 5 }}>
                            <strong>Email:</strong>
                        </Grid>
                        <Grid item xs={8} sx={{ py: 5 }}>
                            {UserInfo.email}
                        </Grid>

                        <Grid item xs={4} sx={{ py: 5 }}>
                            <strong>Location:</strong>
                        </Grid>
                        <Grid item xs={8} sx={{ py: 5 }}>
                            <FormControl variant="standard" sx={{ width: '100%' }}>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {countries.map((country, index) => (
                                        <MenuItem key={index} value={country}>
                                            {country}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4} sx={{ py: 5 }}>
                            <div style={{ marginTop: 8 }}>
                                <strong>Keep Unicorn:</strong>
                            </div>
                        </Grid>
                        <Grid item xs={8} sx={{ py: 5 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={unicorn}
                                        onChange={(e) => setUnicorn(e.target.checked)}
                                    />
                                }
                            />
                        </Grid>
                    </Grid>

                    <SaveButton onClick={handleChanges}>Save</SaveButton>
                    <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
                    <DeleteButton onClick={handleDelete}>Delete Account</DeleteButton>
                </AccountSettingStyle>
            </Modal>
        </>
    );
};

export default Settings;
