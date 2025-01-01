import { Minus } from "react-feather";
import React from "react";
import styled from "styled-components";

const DeleteItems = styled.span`
    cursor: pointer;
    position: absolute;
    right: 25px;
    top: -25px;
    display: ${(props) => (props.editMode ? "block" : "none")};
    background-color: #f44336;
    border-radius: 50%;
    border: 3px solid #fff;
    padding: 3px 1px 1px 1px;
    box-sizing: border-box;
    z-index: 1000;
`;

function DeleteItem({ editMode, onDelete, ...props }) {
    return (
        <DeleteItems editMode={editMode} onClick={onDelete} {...props}>
            <Minus />
        </DeleteItems>
    );
}

export default DeleteItem;
