import React, { useState, forwardRef } from "react";
import { Dialog, DialogContent, TextField, List, ListItem, Divider, Checkbox } from "@mui/material";
import { XCircle, Trash } from "react-feather";
import AddNew from "./widget_component/AddNew";
import DialogHeader from "./widget_component/DialogHeader";
import UnSelected from "./widget_component/UnSelected";
import DialogListContainer from "./widget_component/DialogListContainer";
import DialogDetailsContainer from "./widget_component/DialogDetailsContainer";
import DialogTitle from "./widget_component/DiaglogTitle";
import useApi from "../useApi";
import ContextMenu from "./widget_component/ContextMenu";
import StyledListItem from "./widget_component/StyledListItem";
import ListWrapper  from "./widget_component/ListWrapper";
import AddNewListStyle from "./widget_component/AddNewListStyle";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
const TodosWindow = forwardRef(({ open, setOpen ,todosData}, ref) => {
    const [todos, setTodos] = useState(todosData);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [newTaskName, setNewTaskName] = useState("");
    const [mousePos, setMousePos] = useState({ mouseX: null, mouseY: null });
    const [selectedTask, setSelectedTask] = useState(null);
    const apiCall = useApi();

    const handleClose = () => setOpen(false);

    const handleAddTodo = async () => {
        const newTodo = { title: "New Todo", todos: [] };
        try {
            const data = await apiCall({
                endpoint: 'todo',
                method: 'POST',
                body: newTodo
            });
            setTodos([...todos, data.todo]);
            setSelectedTodo(data.todo);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleDeleteTodo =async () => {
        if (selectedTodo) {
            try {
                await apiCall({
                    endpoint: `todo/${selectedTodo._id}`,
                    method: 'DELETE'
                });
                setTodos(todos.filter((todo) => todo._id !== selectedTodo._id));
                setSelectedTodo(null);
            }catch (e) {
                console.log(e)
            }
        }
    };
    const handleDeleteTask = async () => {
        if (selectedTodo && selectedTask) {
            const updatedTasks = selectedTodo.todos.filter((task) => task._id !== selectedTask._id);
            const updatedTodo = { ...selectedTodo, todos: updatedTasks };
            setTodos(todos.map((todo) => (todo._id === selectedTodo._id ? updatedTodo : todo)));
            setSelectedTodo(updatedTodo);
            setSelectedTask(null);
            try {
                const data = await apiCall({
                    endpoint: `todo/${selectedTodo._id}`,
                    method: 'PUT',
                    body: { todos: updatedTasks },
                });
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === selectedTodo._id ? { ...todo, todos: data.todo.todos } : todo
                    )
                );
            } catch (error) {
                console.error('Error updating todo:', error);
                setTodos((prevTodos) => [...prevTodos]);
            }
        }
    };
    const handleRightClick = (event, todo, task = null) => {
        event.preventDefault();
        setSelectedTodo(todo);
        setSelectedTask(task);
        setMousePos({mouseX: event.clientX - 2, mouseY: event.clientY - 4});
    };
    const handleTitleChange = (e) => setNewTitle(e.target.value);
    const handleTitleSave = async () => {
        if (newTitle.trim() && selectedTodo) {
            try {
                const updatedTodo = { ...selectedTodo, title: newTitle };
                const data = await apiCall({
                    endpoint: `todo/${selectedTodo._id}`,
                    method: 'PUT',
                    body: updatedTodo,
                });

                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === selectedTodo._id ? { ...todo, ...data.todo } : todo
                    )
                );

                setSelectedTodo(data.todo);
                setEditingTitle(false);
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        }
    };


    const handleTaskNameChange = (e) => setNewTaskName(e.target.value);
    const handleTaskSave = async () => {
        if (selectedTodo && editingTaskId && newTaskName.trim()) {
            const updatedTasks = selectedTodo.todos.map((task) =>
                task._id === editingTaskId ? { ...task, text: newTaskName } : task
            );

            const updatedTodo = { ...selectedTodo, todos: updatedTasks };

            setTodos((prevTodos) =>
                prevTodos.map((todo) => (todo._id === selectedTodo._id ? updatedTodo : todo))
            );
            setSelectedTodo(updatedTodo);

            try {
                const data = await apiCall({
                    endpoint: `todo/${selectedTodo._id}`,
                    method: 'PUT',
                    body: updatedTodo,
                });

                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === selectedTodo._id ? { ...todo, todos: data.todo.todos } : todo
                    )
                );
            } catch (error) {
                console.error('Error saving task:', error);

                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === selectedTodo._id ? selectedTodo : todo
                    )
                );
            }

            setEditingTaskId(null);
        }
    };

    const handleEditTask = (task) => {
        setEditingTaskId(task._id);
        setNewTaskName(task.text);
    };
    const handleToggleTask = async (taskId) => {
        if (selectedTodo) {
            const updatedTasks = selectedTodo.todos.map((task) =>
                task._id === taskId ? { ...task, done: !task.done } : task
            );

            const updatedTodo = {
                ...selectedTodo,
                todos: updatedTasks,
            };

            setTodos((prevTodos) =>
                prevTodos.map((todo) => (todo._id === selectedTodo._id ? updatedTodo : todo))
            );
            setSelectedTodo(updatedTodo);

            try {
                const data = await apiCall({
                    endpoint: `todo/${selectedTodo._id}`,
                    method: 'PUT',
                    body: updatedTodo,
                });

                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === selectedTodo._id ? { ...todo, todos: data.todo.todos } : todo
                    )
                );
            } catch (error) {
                console.error('Error toggling task status:', error);
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === selectedTodo._id ? selectedTodo : todo
                    )
                );
            }
        }
    };


    const handleAddTask = async () => {
        if (selectedTodo) {
            const newTask = {text: "New Task", done: false };
            const updatedTodo = {
                ...selectedTodo,
                todos: [...selectedTodo.todos, newTask],
            };

            setTodos((prevTodos) =>
                prevTodos.map((todo) => (todo._id === selectedTodo._id ? updatedTodo : todo))
            );
            setSelectedTodo(updatedTodo);

            try {
                const data = await apiCall({
                    endpoint: `todo/${selectedTodo._id}`,
                    method: 'PUT',
                    body: updatedTodo,
                });

                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === selectedTodo._id ? { ...todo, todos: data.todo.todos } : todo
                    )
                );
            } catch (error) {
                console.error('Error updating todo after adding task:', error);
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === selectedTodo._id ? selectedTodo : todo
                    )
                );
            }
        }
    };

    const onDragEnd = result => {
        const { destination, source } = result;
        if (!destination || destination.index === source.index) {
            return;
        }

        const newTodos = Array.from(todos);
        const [removed] = newTodos.splice(source.index, 1);
        newTodos.splice(destination.index, 0, removed);

        setTodos(newTodos);

        const orderedIds = newTodos.map(note => note._id);
        const updateTodosOrderOnServer = async (orderedIds) => {
            try {
                console.log(orderedIds)
                const response = await apiCall({
                    endpoint: 'todo/reorder',
                    method: 'PUT',
                    body: {orderedTodosIds:orderedIds} ,
                });
                if (!response.success) {
                    console.error('Error reordering notes:', response.message);
                }
            } catch (error) {
                console.error('Error sending reordered notes to server:', error);
            }
        };
        updateTodosOrderOnServer(orderedIds)
    };

    const onDragItemEnd = async (result) => {
        const {destination, source} = result;

        if (!destination) return;

        if (destination.index === source.index) return;

        const updatedTodos = [...selectedTodo.todos];
        const [removed] = updatedTodos.splice(source.index, 1);
        updatedTodos.splice(destination.index, 0, removed);



        setSelectedTodo({...selectedTodo, todos: updatedTodos});
        console.log(updatedTodos)
        await apiCall({
            endpoint: `todo/reorder/${selectedTodo._id}`,
            method: 'PUT',
            body: {tasks :updatedTodos},
        });

    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogHeader title="Todos Widget" onClose={handleClose}/>
            <DialogContent>
                <div style={{display: "flex"}}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="todos">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <DialogListContainer>
                                        {todos.map((todo, index) => (
                                            <Draggable key={todo._id} draggableId={todo._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
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
                                                                        required
                                                                    />
                                                                ) : (
                                                                    todo.title
                                                                )}
                                                            </StyledListItem>
                                                        </ListWrapper>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        <Divider/>

                                    </DialogListContainer>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <AddNew onClick={handleAddTodo}>
                        Add new Task
                    </AddNew>

                    <DialogDetailsContainer>
                        {selectedTodo ? (
                            <div>
                                <DialogTitle>{selectedTodo.title}</DialogTitle>
                                <DragDropContext onDragEnd={onDragItemEnd}>
                                    <Droppable droppableId="task">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                     <List>
                                                         {selectedTodo.todos.map((task,index) => (
                                                             <Draggable key={task._id} draggableId={task._id} index={index}>
                                                                 {(provided) => (
                                                                     <div
                                                                         ref={provided.innerRef}
                                                                         {...provided.draggableProps}
                                                                         {...provided.dragHandleProps}
                                                                     >
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
                                                                     </div>
                                                                 )}
                                                             </Draggable>
                                                             ))}
                                                     </List>
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
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
                    onClose={() => setMousePos({mouseX: null, mouseY: null})}
                    menuItems={
                        selectedTask
                            ? [
                                {
                                    label: "Delete Task",
                                    onClick: handleDeleteTask,
                                    icon: <Trash/>,
                                },
                            ]
                            : selectedTodo
                                ? [
                                    {
                                        label: "Delete Todo",
                                        onClick: handleDeleteTodo,
                                        icon: <XCircle/>,
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