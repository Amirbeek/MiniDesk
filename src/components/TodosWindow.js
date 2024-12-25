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
    TextField,
    CircularProgress,
    Checkbox,
} from "@mui/material";
import { X, Plus, XCircle } from "react-feather";
import styled from "styled-components";

const UnSelected = styled.div`
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #999;
`;

const StyledListItem = styled(ListItem)`
    padding: 10px 10px!important;
    cursor: pointer;
    border-radius: 5px;
`;

const ListWrapper = styled.div`
    padding: 5px 5px 5px 0;
    border-bottom: 1px solid #e1dcdc;
`;

const TodosWindow = forwardRef(({ open, setOpen, TodoData }, ref) => {
    const [todos, setTodos] = useState(TodoData || []);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [newTodoText, setNewTodoText] = useState("");
    const [editingTodoText, setEditingTodoText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [mousePos, setMousePos] = useState({ mouseX: null, mouseY: null });
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => setOpen(false);

    const handleAddTodo = () => {
        if (newTodoText.trim()) {
            const newTodo = { text: newTodoText.trim(), completed: false };
            setTodos([...todos, newTodo]);
            setNewTodoText("");
        }
    };

    const handleSelectTodo = (todo) => {
        setSelectedTodo(todo);
    };

    const handleToggleComplete = (todo) => {
        const updatedTodos = todos.map((t) =>
            t === todo ? { ...t, completed: !t.completed } : t
        );
        setTodos(updatedTodos);
    };

    const handleEditTodo = () => {
        const updatedTodos = todos.map((t) =>
            t === selectedTodo ? { ...t, text: editingTodoText } : t
        );
        setTodos(updatedTodos);
        setIsEditing(false);
        setSelectedTodo({ ...selectedTodo, text: editingTodoText });
    };

    const handleDeleteTodo = () => {
        const updatedTodos = todos.filter((t) => t !== selectedTodo);
        setTodos(updatedTodos);
        setSelectedTodo(null);
        setMousePos({ mouseX: null, mouseY: null });
    };

    const handleContextMenu = (e, todo) => {
        setSelectedTodo(todo);
        setMousePos({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
        e.preventDefault();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                To Do Widget
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    size="small"
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        margin: "8px",
                    }}
                >
                    <SvgIcon>
                        <X />
                    </SvgIcon>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div style={{ display: "flex" }}>
                    {/* Todo List */}
                    <List style={{ width: "30%", borderRight: "1px solid #ddd", paddingRight: "10px" }}>
                        {todos.map((todo) => (
                            <ListWrapper key={todo.text}>
                                <StyledListItem
                                    button
                                    selected={todo === selectedTodo}
                                    onClick={() => handleSelectTodo(todo)}
                                    onContextMenu={(e) => handleContextMenu(e, todo)}
                                    sx={{
                                        backgroundColor: todo === selectedTodo ? "rgba(0, 0, 0, 0.08)" : "transparent",
                                        color: todo === selectedTodo ? "#000" : "inherit",
                                    }}
                                >
                                    <Checkbox
                                        checked={todo.completed}
                                        onChange={() => handleToggleComplete(todo)}
                                        style={{ marginRight: "8px" }}
                                    />
                                    {todo.text}
                                </StyledListItem>
                            </ListWrapper>
                        ))}
                        <Divider />
                        <div style={{ padding: "10px 0", position: "absolute", bottom: "10px" }}>
                            <TextField
                                placeholder="Add a new task"
                                value={newTodoText}
                                onChange={(e) => setNewTodoText(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                            <IconButton onClick={handleAddTodo} style={{ marginTop: "8px" }}>
                                <SvgIcon>
                                    <Plus />
                                </SvgIcon>
                            </IconButton>
                        </div>
                    </List>

                    {/* Todo Details */}
                    <div style={{ width: "70%", paddingLeft: "20px" }}>
                        {selectedTodo ? (
                            isEditing ? (
                                <div>
                                    <TextField
                                        value={editingTodoText}
                                        onChange={(e) => setEditingTodoText(e.target.value)}
                                        onBlur={handleEditTodo}
                                        variant="outlined"
                                        fullWidth
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2>{selectedTodo.text}</h2>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setEditingTodoText(selectedTodo.text);
                                            setIsEditing(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )
                        ) : (
                            <UnSelected>Select a task to view</UnSelected>
                        )}
                    </div>
                </div>
            </DialogContent>
            <Menu
                keepMounted
                open={mousePos.mouseY !== null}
                onClose={() => setMousePos({ mouseX: null, mouseY: null })}
                anchorReference="anchorPosition"
                anchorPosition={
                    mousePos.mouseY !== null && mousePos.mouseX !== null
                        ? { top: mousePos.mouseY, left: mousePos.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleDeleteTodo} style={{ color: "#EB5757" }} disabled={!selectedTodo}>
                    <XCircle /> &nbsp; Delete
                </MenuItem>
            </Menu>
            {isLoading && <CircularProgress style={{ position: "absolute", top: "50%", left: "50%" }} />}
        </Dialog>
    );
});

export default TodosWindow;
