import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Button from './Button';
import Settings from './Settings';
import MenuItem from '@mui/material/MenuItem';

const Search = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '60%',
    maxWidth: '600px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const SettingButton = styled('button')(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    borderRadius: '50%',
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const SettingsMenu = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    position: 'absolute',
    backgroundColor: 'white',
    top: '40px',
    right: '10px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
}));

export default function Navbar({ UserInfo, setEditMode }) {
    const [settingsVisible, setSettingsVisible] = useState(false);

    const handleSettingsClick = () => {
        setSettingsVisible((prev) => !prev);
    };

    // Close settings menu when Enter or Escape is pressed
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
                setSettingsVisible(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', padding: '20px' }}>
                <Toolbar>
                    <MenuItem>
                        App
                    </MenuItem>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* Settings Icon and Dropdown Menu */}
                    <SettingButton onClick={handleSettingsClick}>
                        <SettingsOutlinedIcon />
                    </SettingButton>
                    {settingsVisible && (
                        <SettingsMenu>
                            <Button onClick={() => setEditMode(true)}>Edit Homepage</Button>
                            <Button>Edit Background Image</Button>
                            <Settings UserInfo={UserInfo} />
                        </SettingsMenu>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
