import React, { useState } from "react";
import ComponentButton from "../components/ComponentButton";
import NotesWindow from "../components/NotesWindow";


function Note({notesData}) {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState(notesData);
    const [selectedNote, setSelectedNote] = useState([notesData[0]._id] || null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const Component_data = <>
        {notesData.map((note, index) => (
            <>
                <span key={index}>{note.title}</span> <br/>
            </>
        ))}
    </>

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
                onClick={handleClickOpen}
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
