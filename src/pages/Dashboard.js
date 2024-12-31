import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Calendar from "../dashboard-sections/Calendar";
import NewNavbar from "../components/NewNavbar";
import styled from "styled-components";
import { Grid } from "@mui/material";
import Todo from "../dashboard-sections/Todo";
import Note from "../dashboard-sections/Note";
import BookMark from "../components/BookMark";
import ScrollBox from "../components/ScrollBox";
import Data from '../data'

const BackImage = styled.div`
    background: url("https://w0.peakpx.com/wallpaper/236/488/HD-wallpaper-mac-os-ventura-dark-macos-ventura-macbook-apple-computer.jpg") no-repeat center center;
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
        background-color: ${(props) => (props.editMode ? 'rgba(0, 0, 0, 0.7)' : 'transparent')}; /* Darker overlay */
        z-index: 1;
    }
    > * {
        z-index: 2;

    }

`;
const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [mark, setMark] = useState(Data);
    const [newTitle, setNewTitle] = useState("");
    const [editingTitle, setEditingTitle] = useState(false);
    const [selected, setSelected] = useState(mark[0] || null);
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
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };
        fetchData();
    }, []);


    // const handleAddMark = () => {
    //     const newTodo = { _id: Date.now().toString(), title: "New Todo", todos: [] };
    //     setTodos([...todos, newTodo]);
    //     setSelectedTodo(newTodo);
    // };

    const handleMarkChange = (e) => setNewTitle(e.target.value);

    const handleMarkSave = () => {
        if (newTitle.trim() && selected) {
            const updatedTodos = mark.map((mark) =>
                mark._id === selected._id ? { ...mark, title: newTitle } : mark
            );
            setMark(updatedTodos);
            setSelected((prev) => ({ ...prev, title: newTitle }));
        }
        setEditingTitle(false);
    };

    return (
        <BackImage editMode={editMode}>
            {userData ? (
                <div style={{ position: 'relative' }}>
                    <NewNavbar
                        UserInfo={userData}
                        setEditMode={setEditMode}
                        editMode={editMode}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4} md={8}>
                            <BookMark marks={selected} editMode={editMode} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4} sx={{ padding: 5 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Todo todosData={userData['todos']} onChangeMode={setEditMode} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Note notesData={userData['notes']} onChangeMode={setEditMode} />
                                </Grid>
                            </Grid>
                            <Calendar EventData={userData['events']}  onChangeMode={setEditMode} />
                        </Grid>
                    </Grid>
                    <ScrollBox
                        markData={mark}
                        onSelect={setSelected}
                        onChangeMart={handleMarkChange}
                        editingTitle={editingTitle}
                        selectedToEditMark={selected}
                        onSaveTitle={handleMarkSave}
                        onSetEditMark={setEditingTitle}
                        onSetNewTitle={setNewTitle}
                        editMode={editMode}
                    />
                </div>
            ) : (
                <span>Loading...</span>
            )}
        </BackImage>
    );
};
export default Dashboard;
