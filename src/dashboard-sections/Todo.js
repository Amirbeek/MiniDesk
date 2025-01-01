import React, { useState } from "react";
import ComponentButton from "../components/ComponentButton";
import TodosWindow from "../components/TodosWindow";

function Todo({ todosData,onChangeMode }) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const Component_data = (
        <>
            {Array.isArray(todosData) && todosData[0].todos.map((todoGroup, index) => (
                <React.Fragment key={index}>
                    {todoGroup.title}
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
                todosData={todosData}
            />
        </div>
    );
}

export default Todo;
