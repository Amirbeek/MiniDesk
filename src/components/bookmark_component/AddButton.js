import styled from 'styled-components';
import { FolderPlus } from 'react-feather';
import React from 'react';

const AddButton = styled.div.attrs({
    children: <FolderPlus />,
})`
    padding: 5px 10px;
    cursor: pointer;
    background-color: hsla(0, 0%, 100%, .4);
    border: 1px solid hsla(0, 0%, 100%, .2);
    border-radius: 10px;
    box-shadow: 0 0 .5rem 0 rgba(0, 0, 0, .1);
    color: #333;
    transition: 0.3s;
    margin: 0 10px;
    

    &:hover {
        background-color: #e0e0e0;
    }
`;

export default AddButton;
