import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import styled from 'styled-components';
import { createApi } from 'unsplash-js';
import useApi from '../useApi';
import DialogHeader from "./widget_component/DialogHeader";

const ImageWrapper = styled.div`
    max-width: 100%;
    height: 50vh;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    justify-content: center;
`;

const ImageCard = styled.div`
    width: 150px;
    height: 100px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    border: ${(props) => (props.isSelected ? '2px solid green' : '2px solid transparent')};
    border-radius: 5px;
    transition: border 0.3s;

    &:hover {
        border: 2px solid lightgreen;
    }
`;
const Cancel = styled(Button)`
    text-transform: none;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid #d32f2f!important;
    margin-right: 10px;
    color: #d32f2f!important;
    margin-top: 10px;
    &:hover {
        background-color: #f8d7da;
        box-shadow: 0px 4px 10px rgba(211, 47, 47, 0.2);
    }
`;

const EditBackgroundImage = ({open,setOpen, setUserInfo ,handleClose}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [imageResults, setImageResults] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const apiCall = useApi();
    const unsplash = createApi({ accessKey: 'F_m5vYnTS9mDqW2Zxcz62djK0Ldc5xxHZJuKqC9hXOg' });

    const handleSetBackground =(url)=>{
        setUserInfo((prev) => ({
            ...prev,
            backgroundImage: url,
        }));
        setSelectedImage(url)
    }
    const handleSearch = async () => {
        try {
            const response = await unsplash.search.getPhotos({
                query: searchQuery,
                page: 1,
                perPage: 10,
            });
            setImageResults(response.response.results || []);
        } catch (error) {
            console.error('Error fetching images from Unsplash:', error);
        }
    };

    const handlePutBackgroundImage = async () => {
        if (!selectedImage) {
            alert('Please select an image before saving.');
            return;
        }
        console.log(selectedImage)
        try {
            await apiCall({
                method: 'PUT',
                endpoint: 'image',
                body: { backgroundImage: selectedImage },
            });
            handleClose();
        } catch (e) {
            console.error('Error updating background image:', e);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={()=>handleClose(false)}
                aria-labelledby="user-info-modal"
                aria-describedby="user-info-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 550,
                        bgcolor: 'background.paper',
                        borderRadius: 5,
                        boxShadow: 24,
                        p: '0 2rem 2rem 2rem',
                    }}
                >
                    <DialogHeader title="Edit Background" onClose={handleClose} />

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                        <TextField
                            label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <Button variant="contained" color="success" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>

                    <ImageWrapper>
                        {imageResults.map((image) => {
                            return(
                                    <ImageCard
                                        key={image.id}
                                        style={{backgroundImage: `url(${image.urls.small})`}}
                                        isSelected={selectedImage === image.urls.full}
                                        onClick={()=>handleSetBackground(image.urls.full)}
                                    />
                            )
                        })}
                    </ImageWrapper>

                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 2 }}
                        onClick={handlePutBackgroundImage}
                    >
                        Save Changes
                    </Button>
                    <Cancel
                        onClick={()=>handleClose(false)}
                    >
                        Cancel
                    </Cancel>
                </Box>
            </Modal>
        </>
    );
};

export default EditBackgroundImage;
