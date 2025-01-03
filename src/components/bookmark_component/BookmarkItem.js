import React, { useContext } from "react";
import styled, { keyframes, css } from "styled-components";
import { Minus } from "react-feather";
import DeleteItem from "./DeleteItem";
import { EditHomePageContext } from "../EditHomePage";

const vibration = keyframes`
    0% { transform: rotate(0deg); }
    25% { transform: rotate(2deg); }
    50% { transform: rotate(-2deg); }
    75% { transform: rotate(2deg); }
    100% { transform: rotate(0deg); }
`;

const SingleBookMark = styled.div`
    cursor: ${(props) => (props.editMode ? "default" : "pointer")};
    text-align: center;
    transition: all 0.3s ease;
    color: #eeeeee;
    position: relative;
    ${(props) =>
            props.editMode &&
            css`
                animation: ${vibration} 0.5s infinite;
            `}
    & img {
        background-color: hsla(0, 0%, 100%, 0.4);
        border-radius: 0.8rem;
        box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1);
        display: block;
        height: 4rem;
        margin: 10px auto;
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: ${(props) => (props.editMode ? "none" : "scale(1.2)")};
    }

    & small {
        font-weight: bold;
        text-shadow: 0 1px 3px #000;
    }
`;

const BookmarkItem = ({ bookmark, onDelete }) => {
    const { editMode } = useContext(EditHomePageContext);

    const handleClick = () => {
        if (!editMode) {
            window.open(bookmark.link, "_blank");
        }
    };

    const faviconUrl = bookmark.link
        ? `${new URL(bookmark.link).origin}/favicon.ico`
        : "https://www.google.com/favicon.ico";

    return (
        <SingleBookMark
            onClick={handleClick}
            editMode={editMode}
            role="button"
            aria-label={`Bookmark: ${bookmark.title}`}
        >
            <DeleteItem editMode={editMode} onDelete={() => onDelete(bookmark._id)}>
                <Minus />
            </DeleteItem>
            <img
                src={faviconUrl}
                alt={`${bookmark.title} logo`}
                onError={(e) => {
                    e.target.src = "https://www.google.com/favicon.ico";
                }}
            />
            <small>{bookmark.title}</small>
        </SingleBookMark>
    );
};

export default BookmarkItem;
