import React, { useState } from "react";
import ComponentButton from "../components/ComponentButton";
import NotesWindow from "../components/NotesWindow";


function Note({notesData,onChangeMode}) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const Component_data = (
        <>
            {notesData.slice(0, 4).map((note, index) => (
                <div>
                    <span key={index}>{note.title}</span>
                </div>
            ))}
            {notesData.length > 4 && (
                <span style={{  cursor: "pointer" }}>
                ...and {notesData.length - 5} more
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
                    width: '100%',
                }}
                onClick={()=> {
                    handleClickOpen();
                    onChangeMode(false)
                }}
            >
                <ComponentButton header={'Note'} HeaderColor={'#e77f23'} children={Component_data} />
            </button>

            <NotesWindow
                open={open}
                setOpen={setOpen}
                NoteData={notesData}
            />
        </div>
    );
}

export default Note;
