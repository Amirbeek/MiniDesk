import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function BookmarkDialog({ open, onClose, onSubmit, title, setTitle }) {
    const handleCancel = () => {
        onClose();
    };

    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            PaperProps={{
                style: { width: '400px', maxWidth: 'none' },
            }}
        >
            <DialogTitle>Add New Bookmark</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="bookmarkTitle"
                    label="Bookmark Title"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: '#f9f9f9',
                        },
                        '& .MuiInputLabel-root': {
                            color: '#666',
                        },
                        '& .MuiInputBase-input': {
                            color: '#333',
                        },
                        '& .MuiInputBase-root.Mui-focused': {
                            borderColor: '#4caf50',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4caf50',
                        },
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCancel}
                    sx={{
                        backgroundColor: '#f44336',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#d32f2f',
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    sx={{
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#388e3c',
                        },
                    }}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default BookmarkDialog;
