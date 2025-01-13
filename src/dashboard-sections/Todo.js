import React, { useState } from "react";
import ComponentButton from "../components/ComponentButton";
import TodosWindow from "../components/TodosWindow";

function Todo({ todosData,onChangeMode }) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    let count = 0;
    const Component_data = (
        <div>
            {Array.isArray(todosData) &&
                todosData[0].todos.map((todoGroup, index) => {
                   if (!todoGroup.done && count < 4){
                       count++
                       return (
                           <React.Fragment key={index}>
                               <div style={{display: "flex"}}>
                                   <input
                                       type="checkbox"
                                       style={{
                                           width: '18px',
                                           height: '18px',
                                           appearance: 'none',
                                           WebkitAppearance: 'none',
                                           MozAppearance: 'none',
                                           backgroundColor: 'transparent',
                                           border: '3px solid #4f4f4f',
                                           borderRadius: '4px',
                                           position: 'relative',
                                           marginTop:"auto",
                                           cursor: 'pointer',
                                       }}
                                       onClick={handleClickOpen}
                                   />

                                   <span style={{
                                       display: "block",
                                       whiteSpace: "nowrap",
                                       overflow: "hidden",
                                       textOverflow: "ellipsis",
                                       maxWidth: "100%",
                                       marginTop:"2px"
                                   }}>
                                {todoGroup.text}
                            </span>

                               </div>
                           </React.Fragment>
                       );
                   }
                })
            }
            {count >= 4 && <span style={{marginLeft: 10}}>More...</span>}
        </div>
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
                <ComponentButton header={'To Do List'} HeaderColor={'#333'}>
                    {Component_data}
                </ComponentButton>

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
