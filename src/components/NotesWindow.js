import React, { useState, forwardRef } from "react";
import debounce from "lodash.debounce";
import {
    Dialog,
    DialogContent,
    TextField,
    CircularProgress,
} from "@mui/material";
import { XCircle } from "react-feather";
import { EditorState, ContentState, convertToRaw, convertFromRaw } from "draft-js";
import RichEditor from "./NoteEditor";
import AddNew from "./widget_component/AddNew";
import DialogHeader from "./widget_component/DialogHeader";
import UnSelected from "./widget_component/UnSelected";
import DialogListContainer from "./widget_component/DialogListContainer";
import DialogDetailsContainer from "./widget_component/DialogDetailsContainer";
import ContextMenu from "./widget_component/ContextMenu";
import useApi from "../useApi";
import StyledListItem from "./widget_component/StyledListItem";
import ListWrapper  from "./widget_component/ListWrapper";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const NotesWindow = ({ open, setOpen, NoteData }, ref) => {
    const [notes, setNotes] = useState(NoteData);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [mousePos, setMousePos] = useState({ mouseX: null, mouseY: null });
    const [editingTitle, setEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const apiCall = useApi();

    const debouncedSaveNote = debounce(async (newEditorState) => {
        if (!selectedNote) return;

        const rawContent = convertToRaw(newEditorState.getCurrentContent());
        const updatedNote = {
            ...selectedNote,
            content: rawContent,
            title: selectedNote.title,
        };

        try {
            const data = await apiCall({
                endpoint: `notes/${selectedNote._id}`,
                method: 'PUT',
                body: updatedNote,
            });

            const updatedNotes = notes.map((note) =>
                note._id === selectedNote._id ? data.note : note
            );
            setNotes(updatedNotes);
        } catch (error) {
            console.error('Error saving note:', error);
        }
    }, 500);
    const handleClose = () => setOpen(false);
    const handleAddNote = async () => {
        setIsLoading(true);
        const newNote = { title: "New Note", content: editorState.getCurrentContent() };

        try {
            const data = await apiCall({
                endpoint: 'notes',
                method: 'POST',
                body: newNote,
            });

            setNotes([...notes, data.note]);
            setSelectedNote(data.note);
            setEditorState(
                EditorState.createWithContent(data.note.content || ContentState.createFromText(''))
            );
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

        try {
            await apiCall({
                endpoint: `notes/${selectedNote._id}`,
                method: 'DELETE',
            });

            const updatedNotes = notes.filter((note) => note._id !== selectedNote._id);
            setNotes(updatedNotes);

            if (updatedNotes.length > 0) {
                setSelectedNote(updatedNotes[0]);
                setEditorState(
                    EditorState.createWithContent(updatedNotes[0].content || ContentState.createFromText(''))
                );
            } else {
                setSelectedNote(null);
                setEditorState(EditorState.createEmpty());
            }

            setMousePos({ mouseX: null, mouseY: null });
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
            try {
                await apiCall({
                    endpoint: `notes/${selectedNote._id}`,
                    method: 'PUT',
                    body: updatedNote,
                });

                const updatedNotes = notes.map((note) =>
                    note._id === selectedNote._id ? { ...note, title: newTitle } : note
                );
                setSelectedNote(updatedNote)
                setNotes(updatedNotes);
                setEditingTitle(false);
            } catch (error) {
                console.error('Error saving title:', error);
            }
        } else {
            setEditingTitle(false);
        }
    };

    const onDragEnd = result => {
        const { destination, source } = result;
        if (!destination || destination.index === source.index) {
            return;
        }

        const newNotes = Array.from(notes);
        const [removed] = newNotes.splice(source.index, 1);
        newNotes.splice(destination.index, 0, removed);

        setNotes(newNotes);

        const orderedIds = newNotes.map(note => note._id);
        const updateNotesOrderOnServer = async (orderedIds) => {
            try {
                console.log(orderedIds)
                const response = await apiCall({
                    endpoint: 'notes/reorder',
                    method: 'PUT',
                    body: {orderedNoteIds:orderedIds} ,
                });
                if (!response.success) {
                    console.error('Error reordering notes:', response.message);
                }
            } catch (error) {
                console.error('Error sending reordered notes to server:', error);
            }
        };
        updateNotesOrderOnServer(orderedIds)
    };



    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogHeader title="Note Widget" onClose={handleClose} />
            <DialogContent>
                <div style={{ display: "flex" }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="notes">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <DialogListContainer>
                                        {notes.map((note, index) => (
                                            <Draggable key={note._id} draggableId={note._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <ListWrapper>
                                                            <StyledListItem
                                                                key={note._id}
                                                                button
                                                                selected={note._id === selectedNote?._id}
                                                                onClick={() => handleSelectNote(note)}
                                                                onContextMenu={(e) => {
                                                                    handleContextMenu(e, note._id);
                                                                    handleSelectNote(note);
                                                                }}
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
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </DialogListContainer>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <AddNew onClick={handleAddNote} >
                        Add New Note
                    </AddNew>
                    <DialogDetailsContainer>
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
};

export default NotesWindow;