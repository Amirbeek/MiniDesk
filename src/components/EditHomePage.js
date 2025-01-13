import React, { createContext, useState, useMemo } from "react";

export const EditHomePageContext = createContext({
    editMode: false,
});

export default function EditHomePageProvider({ children }) {
    const [editMode, setEditMode] = useState(false); // editMode is used here

    const providerValue = useMemo(() => ({
        editMode,
        setEditMode
    }), [editMode]);

    return (
        <EditHomePageContext.Provider value={providerValue}>
            {children}
        </EditHomePageContext.Provider>
    );
}
