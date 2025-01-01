import React, { createContext, useState, useMemo } from "react";

export const EditHomePageContext = createContext({
    editMode: false,
    setEditMode: (editMode: boolean) => {}
});

export default function EditHomePageProvider({ children }) {
    const [editMode, setEditMode] = useState(false);

    // Use useMemo to avoid unnecessary re-renders of consumers
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
