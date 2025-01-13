import styled from "styled-components";
import React from 'react';

const ListContainer = styled.div`
    width: 250px;
    height: 60vh;
    overflow-y: auto;        
    padding-right: 10px;     
    border-right: 1px solid #ddd;
    position: relative;
    &::-webkit-scrollbar {
        width: 3px;
        height: 0px; 
    }

    &::-webkit-scrollbar-thumb {
        background: transparent; 
    }

    &::-webkit-scrollbar-track {
        background: transparent; 
    }
    scrollbar-width: thin;
    scrollbar-color: #eeeeee transparent;
`;
function DialogListContainer({children}) {
    return <ListContainer>{children}</ListContainer>
}
export default DialogListContainer;