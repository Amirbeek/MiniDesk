import ComponentButton from "../components/ComponentButton";
import React, {useState} from "react";
import TodosWindow from "../components/TodosWindow";



function Todo({notes}) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const Component_data = <>

    </>
    return <div>
        <button
            style={{
                cursor: "pointer",
                backgroundColor: 'transparent',
                padding: 0,
                marginTop: 15,
                width:'100%'
            }}
            onClick={handleClickOpen}
        >
            <ComponentButton header={'To Do'} HeaderColor={'#333'} children={Component_data}/>
        </button>

        <TodosWindow
        open={open}
        setOpen={setOpen}
        TodoData={notes}
        />
    </div>
}
export default Todo