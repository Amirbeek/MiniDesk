import styled from "styled-components";
import { Plus } from "react-feather";
import React from "react";

const AddNewTitle = styled.div`
    cursor: pointer;
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: flex-start;
    padding: 0 30px;
    background-color: white;
    width: 26%;
    height: 60px;
    color: rgba(103, 98, 98, 0.44);

    &:hover {
        color: #010101;
    }

    &:hover svg {
        color: #010101;
    }

    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; /* Smooth hover transitions */
`;

const StyledPlus = styled(Plus)`
    margin-right: 8px;
    padding: 4px;
    border-radius: 50%;
    color: rgba(103, 98, 98, 0.24);
    transition: border-color 0.3s ease, color 0.3s ease; 
`;

export default function AddNew({ children, ...rest }) {
    return (
        <AddNewTitle {...rest}>
            <StyledPlus />
            {children}
        </AddNewTitle>
    );
}
