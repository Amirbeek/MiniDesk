import React, { useState } from "react";
import ComponentButton from "../components/ComponentButton";
import TodosWindow from "../components/TodosWindow";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";

function Todo({ todosData,onChangeMode }) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const Component_data = (
        <>
            {Array.isArray(todosData) && todosData.slice(0, 4).map((todoGroup, index) => (
                <React.Fragment key={index}>
                    <FormGroup>
                        {Array.isArray(todoGroup.todos) &&
                            todoGroup.todos.map((todo) => (
                                <FormControlLabel
                                    key={todo._id}
                                    disabled={!todo.done}
                                    control={
                                        <Checkbox
                                            defaultChecked={todo.done}
                                            sx={{
                                                cursor: 'pointer',
                                                '&.Mui-disabled': {
                                                    cursor: 'pointer',
                                                },
                                            }}
                                        />
                                    }
                                    label={todo.text}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: 10,
                                            cursor: 'pointer',
                                        },
                                        height: 20,
                                        color: '#000',
                                    }}
                                />
                            ))}
                    </FormGroup>


                    <br />
                </React.Fragment>
            ))}
            {Array.isArray(todosData) && todosData.length > 4 && (
                <span style={{ cursor: "pointer" }}>
                    ...and {todosData.length - 4} more
                </span>
            )}
        </>
    );

    return (
        <div>
            <button
                style={{
                    cursor: "pointer",
                    backgroundColor: 'transparent',
                    padding: 0,
                    marginTop: 15,
                    width: '100%'
                }}
                onClick={() => { handleClickOpen(); onChangeMode(false)}}

            >
                <ComponentButton header={'To Do'} HeaderColor={'#333'} children={Component_data} />
            </button>

            <TodosWindow
                open={open}
                setOpen={setOpen}
                TodoData={todosData}
            />
        </div>
    );
}

export default Todo;
