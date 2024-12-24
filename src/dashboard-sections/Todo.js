import ComponentButton from "../components/ComponentButton";
import React from "react";



function Todo({notes}) {
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
        >
            <ComponentButton header={'To Do'} HeaderColor={'#333'} children={Component_data}/>
        </button>
    </div>
}
export default Todo