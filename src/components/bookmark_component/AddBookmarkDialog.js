import React, { useState, useContext, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button, TextField, Select, MenuItem, Typography, FormControl, InputLabel } from '@mui/material';
import { EditHomePageContext } from "../EditHomePage";

const AddBookmarkDialog = ({ open, setDialogOpen, handleAddBookmark, bookmarks, selectedMarks }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [selectedBookmark, setSelectedBookmark] = useState(selectedMarks?._id || "");
    const { setEditMode } = useContext(EditHomePageContext);

    useEffect(() => {
        if (selectedMarks?._id) {
            setSelectedBookmark(selectedMarks._id);
        }
    }, [selectedMarks]);

    const handleChange = (event) => {
        setSelectedBookmark(event.target.value);
    };

    const formatUrl = (inputUrl) => {
        const protocolRegex = /^(http:\/\/|https:\/\/)/i;
        if (!protocolRegex.test(inputUrl)) {
            return `https://${inputUrl}`;
        }
        return inputUrl;
    };

    const handleAddClick = () => {
        if (!title || !url) {
            alert('Please fill in all fields');
            return;
        }
        const formattedUrl = formatUrl(url);
        handleAddBookmark({ title, url: formattedUrl, parentBookmarkTitle: selectedBookmark });
        setTitle('');
        setUrl('');
        setDialogOpen(false);
        setEditMode(false);
    };

    return (
        <Dialog open={open} onClose={() => { setDialogOpen(false); setEditMode(false); }} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography variant="h6" color="primary">Add New Bookmark</Typography>
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <TextField
                        autoFocus
                        label="Bookmark Title"
                        type="text"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Bookmark URL"
                        type="url"
                        variant="outlined"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="parent-bookmark-select-label">Select Parent Bookmark</InputLabel>
                    <Select
                        labelId="parent-bookmark-select-label"
                        id="parent-bookmark-select"
                        value={selectedBookmark}
                        onChange={handleChange}
                    >
                        {bookmarks.map((bookmark) => (
                            <MenuItem key={bookmark._id} value={bookmark._id}>
                                {bookmark.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setDialogOpen(false); setEditMode(false); }} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddClick} variant="contained" color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddBookmarkDialog;
