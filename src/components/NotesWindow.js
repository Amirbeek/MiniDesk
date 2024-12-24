import React, { useState, forwardRef, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Menu,
    List,
    ListItem,
    Divider,
    IconButton,
    SvgIcon,
    MenuItem,
    TextField
} from "@mui/material";
import { X, Plus, XCircle } from "react-feather";
import { EditorState, ContentState } from "draft-js";  // <-- Import ContentState here
import RichEditor from "./NoteEditor";
import styled from "styled-components"; // Your RichEditor component

const UnSelected = styled.div`
    height: 60vh;
`;

const NotesWindow = forwardRef(({ open, setOpen, NoteData }, ref) => {
    console.log("Note Data", NoteData);
    const [notes, setNotes] = useState(NoteData);
    const [selectedNote, setSelectedNote] = useState(NoteData[0] || null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [mousePos, setMousePos] = useState({ mouseX: null, mouseY: null });
    const [editingTitle, setEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const handleClickOpen = () => {
        if (notes.length > 0) {
            setSelectedNote(notes[0]);
            setEditorState(notes[0].content || EditorState.createEmpty());
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleAddNote = async () => {
        console.log(EditorState.createEmpty());
        const newNote = { title: "New Note", content: editorState.getCurrentContent() };

        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newNote),
            });

            const data = await response.json();
            if (response.ok) {
                setNotes([...notes, data.note]);
                setSelectedNote(data.note);
                setEditorState(EditorState.createWithContent(data.note.content || ContentState.createFromText('')));  // <-- Correctly handle the content
            } else {
                console.error('Error:', data.message || 'Error adding note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleSelectNote = async (note) => {
        setSelectedNote(note);
        const contentState = note.content && note.content.currentContent
            ? note.content.currentContent
            : ContentState.createFromText('')

        setEditorState(EditorState.createWithContent(contentState));

        setEditingTitle(false);
    };



    const handleContextMenu = (e, noteId) => {
        setMousePos({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
        e.preventDefault();
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && selectedNote) {
                handleTitleSave();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedNote, newTitle]);

    const handleDeleteNote = async () => {
        // Check if the selectedNote is valid
        if (!selectedNote || !selectedNote._id) {
            console.error('No note selected or note ID is missing');
            return;
        }

        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`http://localhost:5000/api/notes/${selectedNote._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                // Remove deleted note from state
                const updatedNotes = notes.filter((note) => note._id !== selectedNote._id);
                setNotes(updatedNotes);

                // After deleting, select the first note if there are still notes left
                if (updatedNotes.length > 0) {
                    setSelectedNote(updatedNotes[0]);  // Select the first note
                    setEditorState(EditorState.createWithContent(updatedNotes[0].content || ContentState.createFromText('')));
                } else {
                    setSelectedNote(null); // If no notes are left, clear selection
                    setEditorState(EditorState.createEmpty());
                }

                // Reset the mouse position (used for the context menu)
                setMousePos({ mouseX: null, mouseY: null });
            } else {
                console.error('Error:', data.message || 'Error deleting note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleTitleDoubleClick = (note) => {
        if (selectedNote._id === note._id) {
            setEditingTitle(true);
            setNewTitle(note.title);
        }
    };

    const handleTitleChange = (e) => setNewTitle(e.target.value);

    const handleTitleSave = async () => {
        if (newTitle.trim()) {
            const updatedNote = { ...selectedNote, title: newTitle };

            const token = localStorage.getItem('authToken');

            try {
                const response = await fetch(`http://localhost:5000/api/notes/${selectedNote._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedNote),
                });

                const data = await response.json();
                if (response.ok) {
                    const updatedNotes = notes.map((note) =>
                        note._id === selectedNote._id ? { ...note, title: newTitle } : note
                    );
                    setNotes(updatedNotes);
                    setEditingTitle(false);
                } else {
                    console.error('Error:', data.message || 'Error saving title');
                }
            } catch (error) {
                console.error('Error saving title:', error);
            }
        } else {
            setEditingTitle(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Notes Widget
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    size="small"
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        margin: '8px',
                    }}
                >
                    <SvgIcon>
                        <X />
                    </SvgIcon>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div style={{ display: "flex" }}>
                    {/* Notes List */}
                    <List style={{ width: "30%", borderRight: "1px solid #ddd" }}>
                        {notes.map((note) => (
                            <ListItem
                                key={note._id}
                                button
                                selected={note._id === selectedNote?._id}
                                onClick={() => handleSelectNote(note)}
                                onContextMenu={(e) => handleContextMenu(e, note._id)}
                                onDoubleClick={() => handleTitleDoubleClick(note)}
                            >
                                {editingTitle && selectedNote._id === note._id ? (
                                    <TextField
                                        variant="standard"
                                        type="text"
                                        value={newTitle}
                                        onChange={handleTitleChange}
                                        onBlur={handleTitleSave}
                                        autoFocus
                                        fullWidth
                                    />
                                ) : (
                                    note.title
                                )}
                            </ListItem>
                        ))}

                        <Divider />
                        <span onClick={handleAddNote}
                              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: "absolute", bottom: "10px" }}>
                                <Plus style={{ marginRight: '8px' }} />
                                Add New Note
                        </span>
                    </List>

                    {/* Editor Area */}
                    <div style={{ width: "70%", paddingLeft: "20px" }}>
                        {selectedNote ? (
                            <div>
                                <h2>{selectedNote.title}</h2>
                                <RichEditor editorState={editorState} setEditorState={(newEditorState) => {
                                    setEditorState(newEditorState);
                                    const updatedNotes = notes.map((note) =>
                                        note._id === selectedNote._id ? { ...note, content: newEditorState.getCurrentContent() } : note
                                    );
                                    setNotes(updatedNotes);
                                }} />
                            </div>
                        ) : (
                            <UnSelected>Select a note to edit</UnSelected>
                        )}
                    </div>
                </div>
            </DialogContent>
            <Menu
                keepMounted
                open={mousePos.mouseY !== null}
                onClose={() => setMousePos({ mouseX: null, mouseY: null })}
                anchorReference="anchorPosition"
                anchorPosition={mousePos.mouseY !== null && mousePos.mouseX !== null
                    ? { top: mousePos.mouseY, left: mousePos.mouseX }
                    : undefined}
            >
                <MenuItem onClick={handleDeleteNote} style={{ color: "#EB5757" }} disabled={!selectedNote}>
                    <XCircle /> &nbsp; Delete
                </MenuItem>
            </Menu>
        </Dialog>
    );
});

export default NotesWindow;
