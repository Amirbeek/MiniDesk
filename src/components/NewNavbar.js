import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Settings from "./Settings";
import {useContext, useState} from "react";
import {EditHomePageContext} from "./EditHomePage";
import EditBackgroundImage from "./EditBackgroundImage";
import styled from "styled-components";
import Guidelines from "./Guidelines";
import SettingButton from "./SettingButton";


const SearchParentWrapper = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    background-color: hsla(0, 0%, 100%, 0.58);
    border-radius: 15px;
    overflow: clip;
    box-sizing: border-box
`
const SearchButton =styled.span`
    height: 100%;
    padding: 10px 5px 10px 15px;
    width: 50px;
    transition: .3s;
    cursor: pointer;
    &:hover{
        background-color: hsla(0, 0%, 100%, .10);
    }
`
const SearchInput = styled.input`
    padding: 12px 16px;
    width: 100%;
    border-radius: 15px 0 0 15px;
    border: none; 
    background-color: transparent;
    color: #4F4F4F;
    font-size: 1rem; 
    outline: none; 
    box-shadow: none;
    -webkit-appearance: none; 
    -moz-appearance: none;
    appearance: none;

    &::placeholder {
        color: #4F4F4F; 
        font-size: 0.9rem; 
    }

    &:focus {
        color: #000; 
    }
`;


export default function MenuAppBar({ UserInfo ,setUserInfo,handleOpen}) {
    const { editMode, setEditMode} = useContext(EditHomePageContext);
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        if (query.trim()) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const handelOffEditMode = ()=>{
            setEditMode(true)
            console.log(editMode)
    }
    const handelOffEditModee = ()=>{
        if (editMode === true){
            setEditMode(false)
            console.log(editMode)
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static"  sx={{ backgroundColor: 'transparent', boxShadow: 'none', padding: '10px' }}>
                <Toolbar onClick={handelOffEditModee} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ position: 'absolute', left: 20 }}>
                        <Guidelines/>
                    </Box>

                    <SearchParentWrapper>
                        <SearchInput
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Search"
                        />
                        <SearchButton>
                            <SearchIcon
                                onClick={handleSearch}
                                sx={{
                                    color: '#666',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    transition: 'color 0.3s',
                                    margin:'auto',
                                    '&:hover': {
                                        color: '#333',
                                    },
                                }}/>
                        </SearchButton>
                    </SearchParentWrapper>


                    <Box sx={{position: 'absolute', right: 20}}>
                        <SettingButton
                            size="large"
                            aria-label="Setting"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <div className={'hop'}>
                                <SettingsOutlinedIcon />
                            </div>
                        </SettingButton>
                        <Menu
                            id="menu-appbar"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <Settings UserInfo={UserInfo} />
                            <MenuItem onClick={()=>handleOpen(true)} >Edit Background Image</MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handelOffEditMode();
                                    handleClose();
                                }}
                            >
                                Edit HomePage
                            </MenuItem>
                        </Menu>

                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
