import React, { useState, forwardRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Menu,
    List,
    ListItem,
    Divider,
    IconButton,
    SvgIcon,
    MenuItem,
    TextField,
    Checkbox,
    Button,
    CircularProgress,
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
    margin-bottom: 5px;
    background-color: ${(props) => (props.selected ? "#f0f0f0" : "transparent")};
    &:hover {
        background-color: ${(props) => (props.selected ? "#e0e0e0" : "#f9f9f9")};
    }
`;

const TodosWindow = forwardRef(({ open, setOpen, initialData }, ref) => {
    const [todoGroups, setTodoGroups] = useState(initialData || []);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [newGroupTitle, setNewGroupTitle] = useState("");
    const [newTodoText, setNewTodoText] = useState("");
    const [mousePos, setMousePos] = useState({ mouseX: null, mouseY: null });
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => setOpen(false);

    // Add a new group
    const handleAddGroup = () => {
        if (newGroupTitle.trim()) {
            const newGroup = { title: newGroupTitle.trim(), todos: [] };
            setTodoGroups([...todoGroups, newGroup]);
            setNewGroupTitle("");
        }
    };

    // Select a group to display its todos
    const handleSelectGroup = (group) => {
        setSelectedGroup(group);
    };

    // Add a todo to the selected group
    const handleAddTodo = () => {
        if (newTodoText.trim() && selectedGroup) {
            const updatedGroups = todoGroups.map((group) =>
                group === selectedGroup
                    ? { ...group, todos: [...group.todos, { text: newTodoText.trim(), completed: false }] }
                    : group
            );
            setTodoGroups(updatedGroups);
            setNewTodoText("");
        }
    };

    // Toggle completion of a todo
    const handleToggleComplete = (todo) => {
        const updatedGroups = todoGroups.map((group) =>
            group === selectedGroup
                ? {
                    ...group,
                    todos: group.todos.map((t) =>
                        t === todo ? { ...t, completed: !t.completed } : t
                    ),
                }
                : group
        );
        setTodoGroups(updatedGroups);
    };

    // Delete a todo
    const handleDeleteTodo = (todo) => {
        const updatedGroups = todoGroups.map((group) =>
            group === selectedGroup
                ? { ...group, todos: group.todos.filter((t) => t !== todo) }
                : group
        );
        setTodoGroups(updatedGroups);
    };

    // Delete a group
    const handleDeleteGroup = () => {
        const updatedGroups = todoGroups.filter((group) => group !== selectedGroup);
        setTodoGroups(updatedGroups);
        setSelectedGroup(null);
    };

    const handleContextMenu = (e) => {
        setMousePos({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
        e.preventDefault();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Todo Groups
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
                    {/* Group List */}
                    <List style={{ width: "30%", borderRight: "1px solid #ddd", paddingRight: "10px" }}>
                        {todoGroups.map((group) => (
                            <StyledListItem
                                key={group.title}
                                button
                                selected={group === selectedGroup}
                                onClick={() => handleSelectGroup(group)}
                                onContextMenu={handleContextMenu}
                            >
                                {group.title}
                            </StyledListItem>
                        ))}
                        <Divider />
                        <div style={{ padding: "10px 0", position: "absolute", bottom: "10px" }}>
                            <TextField
                                placeholder="Add a new group"
                                value={newGroupTitle}
                                onChange={(e) => setNewGroupTitle(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                            <IconButton onClick={handleAddGroup} style={{ marginTop: "8px" }}>
                                <SvgIcon>
                                    <Plus />
                                </SvgIcon>
                            </IconButton>
                        </div>
                    </List>

                    {/* Todos in Selected Group */}
                    <div style={{ width: "70%", paddingLeft: "20px" }}>
                        {selectedGroup ? (
                            <div>
                                <h2>{selectedGroup.title}</h2>
                                <List>
                                    {selectedGroup.todos.map((todo, index) => (
                                        <ListItem key={index} style={{ display: "flex", alignItems: "center" }}>
                                            <Checkbox
                                                checked={todo.completed}
                                                onChange={() => handleToggleComplete(todo)}
                                                style={{ marginRight: "8px" }}
                                            />
                                            <span
                                                style={{
                                                    textDecoration: todo.completed ? "line-through" : "none",
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {todo.text}
                                            </span>
                                            <IconButton onClick={() => handleDeleteTodo(todo)}>
                                                <SvgIcon>
                                                    <X />
                                                </SvgIcon>
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider />
                                <TextField
                                    placeholder="Add a new task"
                                    value={newTodoText}
                                    onChange={(e) => setNewTodoText(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    style={{ marginTop: "10px" }}
                                />
                                <Button onClick={handleAddTodo} variant="contained" color="primary" style={{ marginTop: "10px" }}>
                                    Add Task
                                </Button>
                            </div>
                        ) : (
                            <UnSelected>Select a group to view its tasks</UnSelected>
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
                <MenuItem onClick={handleDeleteGroup} style={{ color: "#EB5757" }} disabled={!selectedGroup}>
                    <XCircle /> &nbsp; Delete Group
                </MenuItem>
            </Menu>
            {isLoading && <CircularProgress style={{ position: "absolute", top: "50%", left: "50%" }} />}
        </Dialog>
    );
});

export default TodosWindow;
