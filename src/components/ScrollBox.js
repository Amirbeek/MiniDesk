import React, {useContext, useState, useCallback} from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ScrollContainer from "./bookmark_component/ScrollContainer";
import ItemWrapper from "./bookmark_component/ItemWrapper";
import AddButton from "./bookmark_component/AddButton";
import useApi from "../useApi";
import MiddleWrapper from "./bookmark_component/MiddleWrapper";
import BookmarkDialog from "./bookmark_component/BookmarkDialog";
import InputMarkChange from "./bookmark_component/InputMarkChange";
import { Minus } from "react-feather";
import { EditHomePageContext } from "./EditHomePage";
import "../index.css";
import BookMark from "./BookMark";
import AddBookmarkDialog from "./bookmark_component/AddBookmarkDialog";


const HorizontalScrollBox = ({marks}) => {
    const [mark, setMark] = useState(marks);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogItemOpen, setDialogItemOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [selectedMark, setSelectedMark] = useState(mark[0]);
    const [editingMark, setEditingMark] = useState(false);
    const { editMode, setEditMode } = useContext(EditHomePageContext);
    const apiCall = useApi();
    const resetSelection = useCallback(() => {
        setSelectedMark(null);
        setEditingMark(false);
        setNewTitle("");
    }, []);

    const handleCloseDialog = useCallback(() => setDialogOpen(false), []);

    const handleAddMark = useCallback(async () => {
        if (!newTitle) return;

        try {
            const newMark = { title: newTitle, marks: [] };
            const data = await apiCall({
                endpoint: 'mark',
                method: 'POST',
                body: newMark,
            });
            setMark((prevMarks) => [...prevMarks, data.mark]);
            setDialogOpen(false);
        } catch (error) {
            console.error('Error adding mark:', error.message);
        }
    }, [newTitle, apiCall]);

    const handleDeleteMark = useCallback(
        async (id) => {
            try {
                await apiCall({
                    endpoint: `mark/${id}`,
                    method: 'DELETE',
                });

                setMark((prevMarks) => {
                    const updatedMarks = prevMarks.filter((item) => item._id !== id);
                    if (selectedMark && selectedMark._id === id) {
                        setSelectedMark(updatedMarks.length > 0 ? updatedMarks[0] : null);
                    }

                    return updatedMarks;
                });

                if (selectedMark && selectedMark._id === id) {
                    resetSelection();
                }
            } catch (error) {
                console.error('Error deleting mark:', error.message);
            }
        },
        [apiCall, selectedMark, resetSelection]
    );




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
        console.log(result)
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


    const handleAddBookmark = async ({ title, url, parentBookmarkTitle }) => {
        try {
            const parentMark = mark.find((bookmark) => bookmark._id === parentBookmarkTitle);

            const newBookmark = { link: url, title };

            const updatedParentMark = {
                ...parentMark,
                marks: [...parentMark.marks, newBookmark],
            };

            const data = await apiCall({
                endpoint: `mark/${parentBookmarkTitle}`,
                method: 'PUT',
                body: updatedParentMark,
            });

            setMark((prevMarks) =>
                prevMarks.map((bookmark) =>
                    bookmark._id === parentBookmarkTitle ? data.mark : bookmark
                )
            );

            const updatedSelectedMark = data.mark;
            setSelectedMark(updatedSelectedMark);
        } catch (error) {
            console.error('Error adding bookmark:', error.message);
        }
    };

    const handleDeleteBookmark = async (id) => {
        console.log('Selected Mark:', selectedMark);
        try {
            setMark((prevMarks) => {
                const deleteRecursive = (bookmarks) => {
                    return bookmarks
                        .filter((bookmark) => bookmark._id !== id)
                        .map((bookmark) => ({
                            ...bookmark,
                            marks: deleteRecursive(bookmark.marks || []),
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

                (async () => {
                    try {
                        const updatedParentMark = {
                            ...selectedMark,
                            marks: deleteRecursive(selectedMark.marks || []),
                        };

                        const data = await apiCall({
                            endpoint: `mark/${selectedMark._id}`,
                            method: 'PUT',
                            body: updatedParentMark,
                        });

                        setSelectedMark(data.mark);
                    } catch (error) {
                        console.error('Error updating marks:', error.message);
                    }
                })();

                return updatedMarks;
            });
        } catch (error) {
            console.error('Error deleting bookmark:', error.message);
        }
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