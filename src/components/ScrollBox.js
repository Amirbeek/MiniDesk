import React, {useContext, useState, useCallback} from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ScrollContainer from "./bookmark_component/ScrollContainer";
import ItemWrapper from "./bookmark_component/ItemWrapper";
import AddButton from "./bookmark_component/AddButton";
import Data from "../data";
import MiddleWrapper from "./bookmark_component/MiddleWrapper";
import BookmarkDialog from "./bookmark_component/BookmarkDialog";
import InputMarkChange from "./bookmark_component/InputMarkChange";
import { Minus } from "react-feather";
import { EditHomePageContext } from "./EditHomePage";
import "../index.css";
import BookMark from "./BookMark";
import AddBookmarkDialog from "./bookmark_component/AddBookmarkDialog";
/*Simple of data
*          {
        "_id": "1",
        "title": "Sample BookMark 1",
        "marks": [
            { "_id": "1-1", "link": "https://google.com", "title": "Google" },
            { "_id": "1-2", "link": "https://example.com", "title": "Example" },
            { "_id": "1-3", "link": "https://github.com", "title": "GitHub" }
        ]
    },
*
* */
const HorizontalScrollBox = () => {
    const [mark, setMark] = useState(Data);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogItemOpen, setDialogItemOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [selectedMark, setSelectedMark] = useState(Data[0]);
    const [editingMark, setEditingMark] = useState(false);
    const { editMode, setEditMode } = useContext(EditHomePageContext);

    const resetSelection = useCallback(() => {
        setSelectedMark(null);
        setEditingMark(false);
        setNewTitle("");
    }, []);

    const handleCloseDialog = useCallback(() => setDialogOpen(false), []);

    const handleAddMark = useCallback(() => {
        if (!newTitle) return;
        const newMark = { _id: Date.now().toString(), title: newTitle, marks: [] };
        setMark((prevMarks) => [...prevMarks, newMark]);
        setDialogOpen(false);
    }, [newTitle]);

    const handleDeleteMark = useCallback((id) => {
        setMark((prevMarks) => prevMarks.filter((item) => item._id !== id));
        resetSelection();
    }, [resetSelection]);

    const handleOpenDialog = useCallback(() => {
        setDialogOpen(true);
        setEditMode(false);
    }, [setEditMode]);

    const handleTitleDoubleClick = useCallback((mark) => {
        setEditingMark(true);
        setSelectedMark(mark);
        setNewTitle(mark.title);
    }, []);

    const handleTitleSave = useCallback(() => {
        if (selectedMark && newTitle.trim() !== "") {
            setMark((prevMarks) =>
                prevMarks.map((item) =>
                    item._id === selectedMark._id ? { ...item, title: newTitle } : item
                )
            );
        }
        resetSelection();
    }, [selectedMark, newTitle, resetSelection]);

    const handleSelectMark = useCallback((item) => {
        setSelectedMark(item);
        if (editMode) setEditMode(false);
    }, [editMode, setEditMode]);

    const onDragEnd = useCallback(
        (result) => {
            if (!result.destination) return;
            const items = Array.from(mark);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            setMark(items);
        },
        [mark]
    );
    const onDragEndItems = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        const reorderedMarks = Array.from(selectedMark.marks);
        const [movedItem] = reorderedMarks.splice(source.index, 1);
        reorderedMarks.splice(destination.index, 0, movedItem);

        setMark((prevMarks) => prevMarks.map(mark => {
            if (mark._id === selectedMark._id) {
                return {...mark, marks: reorderedMarks};
            }
            return mark;
        }));
        setSelectedMark((prevSelected) => ({
            ...prevSelected,
            marks: reorderedMarks
        }));
    };


    const handleAddBookmark = ({ title, url, parentBookmarkTitle }) => {
        setMark((prevMarks) => {
            return prevMarks.map((bookmark) => {
                if (bookmark._id === parentBookmarkTitle) {
                    const updatedBookmark = {
                        ...bookmark,
                        marks: [
                            ...bookmark.marks,
                            { _id: Date.now().toString(), link: url, title: title }
                        ]
                    };
                    setSelectedMark(updatedBookmark);
                    return updatedBookmark;
                }
                return bookmark;
            });
        });
    };

    const handleDeleteBookmark = (id) => {
        console.log('Selected Mark:', selectedMark);

        setMark((prevMarks) => {
            const deleteRecursive = (bookmarks) => {
                return bookmarks.filter((bookmark) => bookmark._id !== id)
                    .map((bookmark) => ({
                        ...bookmark,
                        marks: deleteRecursive(bookmark.marks || [])
                    }));
            };

            const updatedMarks = deleteRecursive(prevMarks);

            if (selectedMark && selectedMark._id === id) {
                setSelectedMark(null);
            } else if (selectedMark) {
                const findNewSelected = (bookmarks) => {
                    for (let bookmark of bookmarks) {
                        if (bookmark._id === selectedMark._id) {
                            return bookmark;
                        }
                        const foundInChild = findNewSelected(bookmark.marks || []);
                        if (foundInChild) return foundInChild;
                    }
                    return null;
                };
                const newSelected = findNewSelected(updatedMarks);
                setSelectedMark(newSelected);
            }

            return updatedMarks;
        });
    };

    return (
        <>
            {selectedMark && (
                <BookMark marks={selectedMark ? selectedMark.marks : []}
                          onDragEnd={onDragEndItems}
                          setOpenAddItemDialog={setDialogItemOpen}
                          onDelete={handleDeleteBookmark}/>
            )}
            <DragDropContext onDragEnd={onDragEnd} >
                <MiddleWrapper>
                    <Droppable
                        droppableId="scrollContainer"
                        direction="horizontal"
                        isDropDisabled={editMode}
                    >
                        {(provided, snapshot) => (
                            <ScrollContainer
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                isDraggingOver={snapshot.isDraggingOver}
                                sx={{ position: "relative" }}
                            >
                                {mark.map((item, index) => (
                                    <Draggable
                                        key={item._id}
                                        draggableId={item._id}
                                        index={index}
                                        isDragDisabled={editMode}
                                    >
                                        {(provided) => (
                                            <div
                                                style={{
                                                    position: "relative",
                                                    padding: "15px 10px 10px 10px",
                                                }}
                                                className={editMode && "animation"}
                                            >
                                                <ItemWrapper
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onDoubleClick={() => handleTitleDoubleClick(item)}
                                                    onClick={() => handleSelectMark(item)}
                                                    isSelected={item._id === selectedMark?._id}
                                                >
                                                    {editingMark &&
                                                    selectedMark &&
                                                    item._id === selectedMark._id ? (
                                                        <InputMarkChange
                                                            type="text"
                                                            value={newTitle}
                                                            onChange={(e) => setNewTitle(e.target.value)}
                                                            onBlur={handleTitleSave}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") handleTitleSave();
                                                            }}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        item.title
                                                    )}
                                                </ItemWrapper>
                                                {editMode && (
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            cursor: "pointer",
                                                            right: 15,
                                                            top: 5,
                                                            backgroundColor: "red",
                                                            borderRadius: 40,
                                                            padding: "0px 2px",
                                                            fontSize: 10,
                                                            fontWeight: "bold",
                                                            border: "1px solid #fff",
                                                        }}
                                                    >
                                                        <span onClick={() => handleDeleteMark(item._id)}>
                                                          <Minus size={17} />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ScrollContainer>
                        )}
                    </Droppable>
                    <AddButton onClick={handleOpenDialog} />
                </MiddleWrapper>
            </DragDropContext>
            <BookmarkDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleAddMark}
                title={newTitle}
                setTitle={setNewTitle}
            />
            <AddBookmarkDialog
                open={dialogItemOpen}
                setDialogOpen={setDialogItemOpen}
                bookmarks={mark}
                selectedMarks={selectedMark}
                handleAddBookmark={handleAddBookmark}
            />
        </>
    );
};

export default HorizontalScrollBox;