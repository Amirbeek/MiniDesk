import React from "react";
import styled from "styled-components";
import { Plus } from "react-feather";

const AddBookmarkWrapper = styled.div`
  text-align: center;
  cursor: pointer;
  color: #fff;

  .add {
    background-color: hsla(0, 0%, 100%, 0.4);
    height: 4rem;
    width: 4rem;
    border-radius: 0.8rem;
    margin: 10px auto;
    box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1);
    padding-top: 6px;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  &:hover .add {
    background-color: hsla(0, 0%, 100%, 0.78);
  }

  small {
    font-weight: bold;
    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.54);
  }
`;

const AddBookmarkItem = ({ onAddClick }) => (
    <AddBookmarkWrapper onClick={onAddClick}>
        <div className="add">
            <Plus size={50} />
        </div>
        <small>Add Bookmark</small>
    </AddBookmarkWrapper>
);

export default AddBookmarkItem;
