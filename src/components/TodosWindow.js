import React, { useState, forwardRef } from "react";
import { Dialog, DialogContent, TextField, List, ListItem, Divider, Checkbox, Menu, MenuItem } from "@mui/material";
import { X, Plus, XCircle, Trash } from "react-feather";
import styled from "styled-components";
import AddNew from "./widget_component/AddNew";
import DialogHeader from "./widget_component/DialogHeader";
import UnSelected from "./widget_component/UnSelected";
import DialogListContainer from "./widget_component/DialogListContainer";
import DialogDetailsContainer from "./widget_component/DialogDetailsContainer";
import DialogTitle from "./widget_component/DiaglogTitle";
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
    padding: 5px 0;
    border-bottom: 1px solid #e1dcdc;
`;

const AddNewListStyle = styled.div`
    cursor: pointer;
    height: ${({ itemCount }) =>
            itemCount === 0
                    ? "50vh" 
                    : itemCount < 5
                            ? `${55 - itemCount * 10}vh`
                            : "50px" 
    };

    flex-shrink: 0;
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: height 0.3s ease, background-color 0.3s ease;
`;


const TodosWindow = forwardRef(({ open, setOpen }, ref) => {
    const [todos, setTodos] = useState([
        { _id: "1", title: "Sample Todo", todos: [{ _id: "1-1", text: "Sample Task 1", done: false }, { _id: "1-2", text: "Sample Task 2", done: true }] },
    ]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [newTaskName, setNewTaskName] = useState("");
    const [mousePos, setMousePos] = useState({ mouseX: null, mouseY: null });
    const [selectedTask, setSelectedTask] = useState(null); // Track task selected for deletion

    const handleClose = () => setOpen(false);

    const handleAddTodo = () => {
        const newTodo = { _id: Date.now().toString(), title: "New Todo", todos: [] };
        setTodos([...todos, newTodo]);
        setSelectedTodo(newTodo);
    };

    const handleDeleteTodo = () => {
        if (selectedTodo) {
            setTodos(todos.filter((todo) => todo._id !== selectedTodo._id));
            setSelectedTodo(null);
        }
    };

    const handleDeleteTask = () => {
        if (selectedTodo && selectedTask) {
            const updatedTodos = selectedTodo.todos.filter((task) => task._id !== selectedTask._id);
            const updatedTodo = { ...selectedTodo, todos: updatedTodos };
            setTodos(todos.map((todo) => (todo._id === selectedTodo._id ? updatedTodo : todo)));
            setSelectedTodo(updatedTodo);
            setSelectedTask(null);
        }
    };

    const handleRightClick = (event, todo, task = null) => {
        event.preventDefault();
        setSelectedTodo(todo);
        setSelectedTask(task);
        setMousePos({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 });
    };

    const handleTitleChange = (e) => setNewTitle(e.target.value);

    const handleTitleSave = () => {
        if (newTitle.trim() && selectedTodo) {
            const updatedTodos = todos.map((todo) =>
                todo._id === selectedTodo._id ? { ...todo, title: newTitle } : todo
            );
            setTodos(updatedTodos);
            setSelectedTodo((prev) => ({ ...prev, title: newTitle }));
        }
        setEditingTitle(false);
    };

    const handleTaskNameChange = (e) => setNewTaskName(e.target.value);

    const handleTaskSave = () => {
        if (selectedTodo && editingTaskId && newTaskName.trim()) {
            const updatedTodo = {
                ...selectedTodo,
                todos: selectedTodo.todos.map((task) =>
                    task._id === editingTaskId ? { ...task, text: newTaskName } : task
                ),
            };
            setTodos(todos.map((todo) => (todo._id === selectedTodo._id ? updatedTodo : todo)));
            setSelectedTodo(updatedTodo);
        }
        setEditingTaskId(null);
    };

    const handleEditTask = (task) => {
        setEditingTaskId(task._id); // Set the task ID that is being edited
        setNewTaskName(task.text);   // Set the task's current text to be edited
    };

    const handleToggleTask = (taskId) => {
        if (selectedTodo) {
            const updatedTodo = {
                ...selectedTodo,
                todos: selectedTodo.todos.map((task) =>
                    task._id === taskId ? { ...task, done: !task.done } : task
                ),
            };
            setTodos(todos.map((todo) => (todo._id === selectedTodo._id ? updatedTodo : todo)));
            setSelectedTodo(updatedTodo);
        }
    };

    const handleAddTask = () => {
        if (selectedTodo) {
            const updatedTodo = {
                ...selectedTodo,
                todos: [...selectedTodo.todos, { _id: Date.now().toString(), text: "New Task", done: false }],
            };
            setTodos(todos.map((todo) => (todo._id === selectedTodo._id ? updatedTodo : todo)));
            setSelectedTodo(updatedTodo);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogHeader title="Todos Widget" onClose={handleClose} />
            <DialogContent>
                <div style={{display: "flex"}}>
                    <DialogListContainer>
                        {todos.map((todo) => (
                            <ListWrapper key={todo._id}>
                                <StyledListItem
                                    button
                                    selected={todo._id === selectedTodo?._id}
                                    onClick={() => setSelectedTodo(todo)}
                                    onDoubleClick={() => {
                                        setEditingTitle(true);
                                        setNewTitle(todo.title);
                                    }}
                                    sx={{
                                        backgroundColor: todo._id === selectedTodo?._id ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                                        color: todo._id === selectedTodo?._id ? '#000' : 'inherit',
                                    }}
                                    onContextMenu={(e) => handleRightClick(e, todo)}
                                >
                                    {editingTitle && selectedTodo?._id === todo._id ? (
                                        <TextField
                                            variant="standard"
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
                                            todo.title
                                    )}
                                </StyledListItem>
                            </ListWrapper>
                        ))}
                        <Divider/>

                    </DialogListContainer>
                    <AddNew
                        onClick={handleAddTodo}
                    > Add new Task
                        </AddNew>
                    <DialogDetailsContainer>
                        {selectedTodo ? (
                            <div>
                                <DialogTitle>{selectedTodo.title}</DialogTitle>
                                <List>
                                    {selectedTodo.todos.map((task) => (
                                        <ListItem
                                            key={task._id}
                                            onContextMenu={(e) => handleRightClick(e, selectedTodo, task)}

                                        >
                                            <Checkbox
                                                checked={task.done}
                                                onChange={() => handleToggleTask(task._id)}
                                            />
                                            {editingTaskId === task._id ? (
                                                <TextField
                                                    variant="standard"
                                                    value={newTaskName}
                                                    onChange={handleTaskNameChange}
                                                    onBlur={handleTaskSave}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleTaskSave();
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span onDoubleClick={() => handleEditTask(task)}>
                                                {task.text}
                                            </span>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                                <AddNewListStyle
                                    onClick={handleAddTask}
                                    itemCount={selectedTodo.todos.length}
                                >
                                    {selectedTodo.todos.length === 0}
                                </AddNewListStyle>
                            </div>
                        ) : (
                            <UnSelected>Select a todo to view details</UnSelected>
                        )}
                    </DialogDetailsContainer>
                </div>
                <ContextMenu
                    mousePos={mousePos}
                    onClose={() => setMousePos({ mouseX: null, mouseY: null })}
                    menuItems={
                        selectedTask
                            ? [
                                {
                                    label: "Delete Task",
                                    onClick: handleDeleteTask,
                                    icon: <Trash />,
                                },
                            ]
                            : selectedTodo
                                ? [
                                    {
                                        label: "Delete Todo",
                                        onClick: handleDeleteTodo,
                                        icon: <XCircle />,
                                    },
                                ]
                                : []
                    }
                />
            </DialogContent>
        </Dialog>
    );
});

export default TodosWindow;