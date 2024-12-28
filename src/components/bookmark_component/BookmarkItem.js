import React from "react";
import styled, { keyframes, css } from "styled-components";
import { Minus } from "react-feather";

// Define the vibration animation using keyframes
const vibration = keyframes`
    0% { transform: rotate(0deg); }
    25% { transform: rotate(2deg); }
    50% { transform: rotate(-2deg); }
    75% { transform: rotate(2deg); }
    100% { transform: rotate(0deg); }
`;

const SingleBookMark = styled.div`
    cursor: ${(props) => (props.editMode ? 'default' : 'pointer')}; /* Change cursor when in edit mode */
    text-align: center;
    transition: all 0.3s ease;
    color: #eeeeee;
    position: relative;

    /* Apply vibration animation when in editMode */
    ${(props) =>
            props.editMode &&
            css`
            animation: ${vibration} 0.5s infinite;
        `}

    span {
        cursor: pointer;
        position: absolute;
        right: 70px;
        top: -20px;
        display: ${(props) => (props.editMode ? 'block' : 'none')}; /* Only show minus icon in editMode */
        background-color: #f44336;
        border-radius: 50%;
        border: 3px solid #fff;
        padding: 3px 1px 1px 1px;
        box-sizing: border-box;
    }

    & img {
        background-color: hsla(0, 0%, 100%, 0.4);
        border-radius: .8rem;
        box-shadow: 0 0 .5rem 0 rgba(0, 0, 0, 0.1);
        display: block;
        height: 4rem;
        margin: 10px auto;
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: ${(props) => (props.editMode ? 'none' : 'scale(1.2)')}; /* Disable hover scale if editMode is true */
    }

    & small {
        font-weight: bold;
        text-shadow: 0px 1px 3px #000;
    }
`;

const BookmarkItem = ({ bookmark, onClick, editMode , onDelete }) => {
    const handleClick = () => {
        if (editMode ===false) {
            onClick(bookmark.link);
        }
    };

    return (
        <SingleBookMark
            onClick={handleClick}
            editMode={editMode}
        >
            <span onClick={onDelete}>
                <Minus />
            </span>
            <img
                src={`${new URL(bookmark.link).origin}/favicon.ico`}
                alt={`${bookmark.title} logo`}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/16';
                }}
            />
            <small>{bookmark.title}</small>
        </SingleBookMark>
    );
};

export default BookmarkItem;
