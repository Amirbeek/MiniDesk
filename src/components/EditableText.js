import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import styled from 'styled-components';

const EditableText = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState('Click to edit me');

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
        }
    };

    return (
        <Wrapper>
            {isEditing ? (
                <TextField
                    value={text}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <Typography onClick={() => setIsEditing(true)}>{text}</Typography>
            )}
        </Wrapper>
    );
};

// Styled component for wrapping the content
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 100vh;
`;

export default EditableText;
