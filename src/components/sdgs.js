import React, { useState, forwardRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, List, ListItem, Divider, IconButton, SvgIcon, MenuItem } from "@mui/material";
import { X, Plus, XCircle } from "react-feather";
import { EditorState } from "draft-js";
import RichEditor from "./NoteEditor"; // Your RichEditor component

const NotesWindow = forwardRef(({ open, setOpen }, ref) => {
    const [notes, setNotes] = useState([
        { title: "Note 1", _id: "1", content: EditorState.createEmpty() },
        { title: "Note 2", _id: "2", content: EditorState.createEmpty() },
    ]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [mousePos, setMousePos] = useState({ mouseX: null, mouseY: null });
    const [editingTitle, setEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const handleClickOpen = () => {
        setSelectedNote(notes[0]); // Default selection is the first note
        setEditorState(notes[0].content || EditorState.createEmpty()); // Set the editor content for the first note
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleAddNote = () => {
        const newNote = { title: "New Note", _id: (notes.length + 1).toString(), content: EditorState.createEmpty() };
        setNotes([...notes, newNote]);
        setSelectedNote(newNote);
        setEditorState(EditorState.createEmpty());
    };

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setEditorState(note.content || EditorState.createEmpty());
    };

    const handleContextMenu = (e, noteId) => {
        setMousePos({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
        e.preventDefault();
    };

    const handleDeleteNote = () => {
        setNotes(notes.filter((note) => note._id !== selectedNote._id));
        setSelectedNote(null);
        setEditorState(EditorState.createEmpty());
        setMousePos({ mouseX: null, mouseY: null });
    };

    const handleTitleDoubleClick = () => {
        if (selectedNote) {
            setEditingTitle(true);
            setNewTitle(selectedNote.title);
        }
    };

    const handleTitleChange = (e) => setNewTitle(e.target.value);

    const handleTitleSave = () => {
        const updatedNotes = notes.map((note) =>
            note._id === selectedNote._id ? { ...note, title: newTitle } : note
        );
        setNotes(updatedNotes);
        setEditingTitle(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Notes
                <IconButton aria-label="close" onClick={handleClose} size="small">
                    <SvgIcon><X /></SvgIcon>
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
                                onDoubleClick={handleTitleDoubleClick}
                            >
                                {/* Editor Area and monitor area */}
                                {editingTitle && note._id === selectedNote?._id ? (
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={handleTitleChange}
                                        onBlur={handleTitleSave}
                                        autoFocus
                                    />
                                ) : (
                                    note.title
                                )}
                            </ListItem>
                        ))}
                        <Divider />
                        <Button startIcon={<Plus />} onClick={handleAddNote}>
                            Add New Note
                        </Button>
                    </List>
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
                <MenuItem onClick={handleDeleteNote} style={{ color: "#EB5757" }}>
                    <XCircle /> &nbsp; Delete
                </MenuItem>
            </Menu>
        </Dialog>
    );
});

export default NotesWindow;
