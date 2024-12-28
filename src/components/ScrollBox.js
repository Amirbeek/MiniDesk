import React from "react";
import { Scrollbar } from "react-scrollbars-custom";
import styled from "styled-components";
import { FolderPlus } from "react-feather";
import { TextField } from "@mui/material";

const FooterStyle = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px; /* Adjusted height for better appearance */
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Align items to the left */
    z-index: 1000 !important;
    padding: 0 20px;
    background-color: ${(props) => (props.editMode ? 'rgba(0, 0, 0, 0.7)' : 'transparent')};
`;

const ScrollbarStyle = styled(Scrollbar)`
    width: 100%; /* Make sure the scrollbar takes full width */
    height: 100%; /* Make sure it takes full height */
    border-radius: 8px; /* Rounded corners */
    padding: 10px; /* Padding for inner spacing */
    box-sizing: border-box; /* Ensure padding doesn't affect overall size */    
`;

const ScrollBarWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: auto; /* Enable horizontal scroll */
    padding-right: 30px;

    & .folder-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 8px;
        background-color: hsla(0, 0%, 100%, 0.4);
    }

    & .folder-wrapper:hover {
        background-color: hsla(0, 0%, 100%, 0.66);
    }

    & .folder-title {
        color: #333;
        white-space: nowrap;
    }

    & .folder-wrapper.clicked {
        background-color: hsla(0, 0%, 100%, 0.8);
    }
`;

const AddButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: hsla(0, 0%, 100%, 0.4);
    cursor: pointer;
    margin-left: 10px; 
    &:hover {
        background-color: hsla(0, 0%, 100%, 0.66);
    }
`;

const HorizontalScrollBox = ({
                                 markData,
                                 onSelect,
                                 onChangeMart,
                                 editingTitle,
                                 selectedToEditMark,
                                 newTitle,
                                 onSaveTitle,
                                 onSetEditMark,
                                 onSetNewTitle,
                                 editMode,
                             }) => {
    return (
        <FooterStyle editMode={editMode}>
            <ScrollbarStyle horizontal={true} noScrollX={false} noScrollY={true} >
                <div>
                    <ScrollBarWrapper>
                        {markData.map((item) => (
                            <div
                                key={item._id}
                                className={`folder-wrapper ${selectedToEditMark?._id === item._id ? "clicked" : ""}`}
                                onClick={() => onSelect(item)}
                                onDoubleClick={() => {
                                    onSetEditMark(true);
                                    onSetNewTitle(item.title);
                                }}
                            >
                                {!editMode && editingTitle && selectedToEditMark?._id === item._id ? (
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={onChangeMart}
                                        onBlur={onSaveTitle}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") onSaveTitle();
                                        }}
                                        defaultValue={item.title}
                                        autoFocus
                                        style={{
                                            height: "15px",
                                            width: "150px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            outline: "none",
                                            fontSize: "14px",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                ) : (
                                    <div className="folder-title">{item.title}</div>
                                )}
                            </div>
                        ))}

                    </ScrollBarWrapper>
                </div>
                <div>
                    <AddButton>
                        <FolderPlus size={20}/>
                    </AddButton>
                </div>
            </ScrollbarStyle>

        </FooterStyle>
    );
};

export default HorizontalScrollBox;
