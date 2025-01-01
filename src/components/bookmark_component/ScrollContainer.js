import styled from 'styled-components';

const ScrollContainer = styled.div`
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    background: transparent;
    position: relative;
    width: 100%;

    &::-webkit-scrollbar {
        height: 0;
        background-color: #F5F5F5;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #B6B6B6;
        border-radius: 10px;
        border: 2px solid #F5F5F5;
    }

    &::-webkit-scrollbar-track {
        background-color: #F5F5F5;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-button {
        display: none;
    }
`;

export default ScrollContainer;
