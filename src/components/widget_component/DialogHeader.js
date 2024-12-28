import React from 'react';
import { DialogTitle, IconButton, SvgIcon } from '@mui/material';
import { X } from "react-feather";

// Reusable DialogHeader component
const DialogHeader = ({ title, onClose }) => {
    return (
        <DialogTitle>
            {title}
            <IconButton
                aria-label="close"
                onClick={onClose}
                size="small"
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    margin: '8px',
                }}
            >
                <SvgIcon>
                    <X />
                </SvgIcon>
            </IconButton>
        </DialogTitle>
    );
};

export default DialogHeader;
