import React, { useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Grid } from "@mui/material";
import BookmarkItem from "./bookmark_component/BookmarkItem";
import AddBookmarkItem from "./bookmark_component/AddBookmarkItem";
import { EditHomePageContext } from "./EditHomePage";

const BookmarkGrid = ({ onDelete, marks, onDragEnd, setOpenAddItemDialog }) => {
    const { editMode, setEditMode } = useContext(EditHomePageContext);

    const handleClick = (link, event) => {
        if (!editMode) {
            window.open(link, "_blank");
        } else {
            event.preventDefault();
        }
    };

    const handleGridClick = (event) => {
        if (event.target === event.currentTarget) {
            setEditMode(false);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="bookmarks" direction="horizontal" >
                {(provided) => (
                    <Grid
                        container
                        spacing={1}
                        style={{ padding: "30px" }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        onClick={handleGridClick}
                    >
                        {marks.map((bookmark, index) => (
                            <Draggable key={bookmark._id} draggableId={bookmark._id} index={index} >
                                {(provided) => (
                                    <Grid
                                        item
                                        xs={6}
                                        sm={4}
                                        md={3}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={(event) => handleClick(bookmark.url, event)}
                                    >
                                        <BookmarkItem
                                            onDelete={onDelete}
                                            bookmark={bookmark}
                                            editMode={editMode}
                                        />
                                    </Grid>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        {!editMode && (
                            <Grid item xs={6} sm={4} md={3}>
                                <AddBookmarkItem onAddClick={() => setOpenAddItemDialog(true)} />
                            </Grid>
                        )}
                    </Grid>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default BookmarkGrid;
