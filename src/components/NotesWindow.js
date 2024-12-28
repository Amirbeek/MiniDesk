import React, { useState, forwardRef } from "react";
import debounce from "lodash.debounce";
import {
    Dialog,
    DialogContent,
    ListItem,
    Divider,
    TextField,
    CircularProgress,
} from "@mui/material";
import { XCircle } from "react-feather";
import { EditorState, ContentState, convertToRaw, convertFromRaw } from "draft-js";
import RichEditor from "./NoteEditor"; // Assuming you have a RichEditor component
import styled from "styled-components";
import AddNew from "./widget_component/AddNew";
import DialogHeader from "./widget_component/DialogHeader";
import UnSelected from "./widget_component/UnSelected";
import DialogListContainer from "./widget_component/DialogListContainer";
import DialogDetailsContainer from "./widget_component/DialogDetailsContainer";
import ContextMenu from "./widget_component/ContextMenu";

const StyledListItem = styled(ListItem)`
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 5px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;
const ListWrapper = styled.div`
    padding: 5px 5px 5px 0;
    border-bottom: 1px solid #e1dcdc;
`;




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
                const updatedNotes = notes.map((note) =>
                    note._id === selectedNote._id ? updatedNote : note
                );
                setNotes(updatedNotes);
            } else {
                console.error('Error:', data.message || 'Error saving note');
            }
        } catch (error) {
            console.error('Error saving note:', error);
        }
    }, 500);

    const handleClose = () => setOpen(false);

    const handleAddNote = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    };

    const handleSelectNote = async (note) => {
        setSelectedNote(note);

        let contentState;
        if (note.content && note.content.blocks && Array.isArray(note.content.blocks)) {
            const content = note.content;
            const rawContent = {
                blocks: content.blocks,
                entityMap: content.entityMap || {}
            };

            try {
                contentState = convertFromRaw(rawContent);
            } catch (error) {
                console.error('Error converting raw content:', error);
                contentState = ContentState.createFromText('');
            }
        } else {
            contentState = ContentState.createFromText('');
        }

        setEditorState(EditorState.createWithContent(contentState));
    };

    const handleContextMenu = (e) => {
        setMousePos({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
        e.preventDefault();
    };
    const handleDeleteNote = async () => {
        if (!selectedNote || !selectedNote._id) {
            console.error('No note selected or note ID is missing');
            return;
        }

        setIsLoading(true);
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
            setIsLoading(false);
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
            <DialogHeader title="Note Widget" onClose={handleClose} />
            <DialogContent>
                < div style={{display: "flex"}}>
                        <DialogListContainer >
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
                                                <TextField
                                                    variant="standard"
                                                    type="text"
                                                    value={newTitle}
                                                    onChange={handleTitleChange}
                                                    onBlur={handleTitleSave}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleTitleSave();
                                                    }}
                                                    autoFocus
                                                    fullWidth
                                                />
                                        ) : (
                                            note.title
                                        )}
                                    </StyledListItem>
                                </ListWrapper>
                            ))}
                            <Divider />
                        </DialogListContainer>
                        <AddNew onClick={handleAddNote} >
                            Add New Note
                        </AddNew>
                    <DialogDetailsContainer >
                        {selectedNote ? (
                                <RichEditor
                                    title={selectedNote.title}
                                    editorState={editorState}
                                    setEditorState={(newEditorState) => {
                                        setEditorState(newEditorState);
                                        debouncedSaveNote(newEditorState);
                                    }}
                                />
                        ) : (
                            <UnSelected>Select a note to edit</UnSelected>
                        )}
                    </DialogDetailsContainer>
                <div/>
                </div>
                <ContextMenu
                    mousePos={mousePos}
                    onClose={() => setMousePos({ mouseX: null, mouseY: null })}
                    menuItems={[
                        {
                            label: "Delete",
                            onClick: handleDeleteNote,
                            icon: <XCircle />,
                            disabled: !selectedNote,
                            style: { color: "#EB5757" },
                        },
                    ]}
                />

            </DialogContent>

            {isLoading && <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}
        </Dialog>
    );
});

export default NotesWindow;
