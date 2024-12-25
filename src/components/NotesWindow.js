import React, { useState, forwardRef, useEffect, useCallback } from "react";
import debounce from "lodash.debounce"; // Import debounce function
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
    TextField,
    CircularProgress
} from "@mui/material";
import { X, Plus, XCircle } from "react-feather";
import { EditorState, ContentState, convertToRaw, convertFromRaw } from "draft-js";
import RichEditor from "./NoteEditor"; // Your RichEditor component
import styled from "styled-components";

const UnSelected = styled.div`
    height: 60vh;
`;
const StyledListItem = styled(ListItem)`
    padding: 10px 10px!important;
    cursor: pointer;
    border-radius: 5px;
`
const ListWrapper = styled.div`
    padding: 5px 5px 5px 0;
    border-bottom: 1px solid #e1dcdc;

`

const NotesWindow = forwardRef(({ open, setOpen, NoteData }, ref) => {
    const [notes, setNotes] = useState(NoteData);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [mousePos, setMousePos] = useState({ mouseX: null, mouseY: null });
    const [editingTitle, setEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSaveNote = debounce(async (newEditorState) => {
        if (!selectedNote) return;
        const rawContent = convertToRaw(newEditorState.getCurrentContent());

        const updatedNote = {
            ...selectedNote,
            content: rawContent,
            title: selectedNote.title
        };

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
                // Update the note in the local state after successful save
                const updatedNotes = notes.map((note) =>
                    note._id === selectedNote._id ? updatedNote : note
                );
                setNotes(updatedNotes); // Update the local state with the new content
            } else {
                console.error('Error:', data.message || 'Error saving note');
            }
        } catch (error) {
            console.error('Error saving note:', error);
        }
    }, 500);

    const handleClose = () => setOpen(false);

    const handleAddNote = async () => {
        setIsLoading(true);  // Show loading indicator
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
                setEditorState(EditorState.createWithContent(data.note.content || ContentState.createFromText('')));
            } else {
                console.error('Error:', data.message || 'Error adding note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setIsLoading(false);  // Hide loading indicator
        }
    };

    const handleSelectNote = async (note) => {
        setSelectedNote(note);

        let contentState;

        if (note.content && note.content.blocks && Array.isArray(note.content.blocks)) {
            // Ensure `content.entityMap` is present and is an object
            const content = note.content;
            const rawContent = {
                blocks: content.blocks,
                entityMap: content.entityMap || {} // Use an empty object if entityMap is missing
            };

            try {
                // Attempt to convert the raw content to Draft.js content state
                contentState = convertFromRaw(rawContent);
            } catch (error) {
                console.error('Error converting raw content:', error);
                // Fallback to empty content if conversion fails
                contentState = ContentState.createFromText('');  // Empty content
            }
        } else {
            console.warn('Invalid content structure for note:', note._id);
            // Fallback to empty content if structure is invalid
            contentState = ContentState.createFromText('');  // Empty content
        }

        // Set the editor state with the validated content
        setEditorState(EditorState.createWithContent(contentState));
    };

    const handleContextMenu = (e) => {
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
        if (!selectedNote || !selectedNote._id) {
            console.error('No note selected or note ID is missing');
            return;
        }

        setIsLoading(true);  // Show loading indicator
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
                const updatedNotes = notes.filter((note) => note._id !== selectedNote._id);
                setNotes(updatedNotes);

                if (updatedNotes.length > 0) {
                    setSelectedNote(updatedNotes[0]);
                    setEditorState(EditorState.createWithContent(updatedNotes[0].content || ContentState.createFromText('')));
                } else {
                    setSelectedNote(null);
                    setEditorState(EditorState.createEmpty());
                }

                setMousePos({ mouseX: null, mouseY: null });
            } else {
                console.error('Error:', data.message || 'Error deleting note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        } finally {
            setIsLoading(false);  // Hide loading indicator
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
                    <List style={{ width: "30%", borderRight: "1px solid #ddd" , paddingRight: '10px'}}>
                        {notes.map((note) => (
                            <ListWrapper>
                                <StyledListItem
                                    key={note._id}
                                    button
                                    selected={note._id === selectedNote?._id}
                                    onClick={() => handleSelectNote(note)}
                                    onContextMenu={(e) => handleContextMenu(e, note._id)}
                                    onDoubleClick={() => handleTitleDoubleClick(note)}
                                    sx={{
                                        backgroundColor: note._id === selectedNote?._id ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                                        color: note._id === selectedNote?._id ? '#000' : 'inherit',

                                    }}
                                >
                                    {editingTitle && selectedNote._id === note._id ? (
                                        <div>
                                            <TextField
                                                variant="standard"
                                                type="text"
                                                value={newTitle}
                                                onChange={handleTitleChange}
                                                onBlur={handleTitleSave}
                                                autoFocus
                                                fullWidth
                                            />

                                        </div>
                                    ) : (
                                        note.title
                                    )}
                                </StyledListItem>
                            </ListWrapper>
                        ))}
                        <Divider />
                        <span onClick={handleAddNote} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: "absolute", bottom: "10px" }}>
                            <Plus style={{ marginRight: '8px' }} />
                            Add New Note
                        </span>
                    </List>

                    {/* Editor Area */}
                    <div style={{ width: "70%", paddingLeft: "20px" }}>
                        {selectedNote ? (
                            <div>
                                <h2>{selectedNote.title}</h2>
                                <RichEditor
                                    editorState={editorState}
                                    setEditorState={(newEditorState) => {
                                        setEditorState(newEditorState);
                                        debouncedSaveNote(newEditorState);
                                    }}
                                />
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
            {isLoading && <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}
        </Dialog>
    );
});

export default NotesWindow;
