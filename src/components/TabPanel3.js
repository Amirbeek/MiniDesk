import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GUIImage from '../background_images/s2.jpg';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
export default function TabPanel3() {
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleCopy = () => {
        const linkToCopy = "https://www.minidesk.me";
        navigator.clipboard.writeText(linkToCopy);
        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 1500);
    };

    return (
        <>
            <Typography variant="h6" gutterBottom  sx={{
                textTransform: "uppercase",
            }}>
                How to set Tiny Desk as Homepage for Firefox
            </Typography>
            <ol>
                <li>
                    <Typography sx={{flexGrow: 1}} variant="body1">
                        Click <DensityMediumIcon sx={{
                        verticalAlign: "middle",
                        backgroundColor: "#504f4f",
                        padding: "2px",
                        borderRadius: "4px"
                    }}/> and go to Preferences
                    </Typography>
                </li>

                <li>
                    <Typography sx={{marginTop: 3}} variant="body1">
                        Click "Home" tab
                    </Typography>
                </li>
                <li>
                    <Typography sx={{marginTop: 3}} variant="body1">
                        On "Homepage and new windows", select "Custom URLs..."
                    </Typography>
                </li>
                <li>
                    <Typography sx={{marginTop: 3}} variant="body1">
                        Copy and paste URL into the URL field
                    </Typography>
                </li>
            </ol>

            <Box display="flex" alignItems="center" justifyContent={'left'} gap={1} mt={2}>
                <div style={{display: 'flex',}}>
                    <Typography variant="subtitle1" sx={{flexGrow: 1,marginTop:1.5}}>
                        https://www.minidesk.me
                    </Typography>
                    <button
                        onClick={handleCopy}
                        style={{
                            borderRadius: '5px',
                            background: 'transparent',
                            cursor: 'pointer',
                            gap: '5px',
                            color:'#000',
                        }}
                    >
                        <ContentCopyIcon />
                    </button>
                </div>
                {tooltipVisible && (
                    <Typography variant="body2" color="green">
                        Link copied to clipboard!
                    </Typography>
                )}
            </Box>

            <img url={GUIImage} alt="" style={{ width: '100%' }} src={GUIImage} />


        </>
    );
}
