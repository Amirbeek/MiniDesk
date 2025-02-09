import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GUIImage from '../background_images/s.jpg';

export default function TabPanel1() {
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleCopy = () => {
        const linkToCopy = "https://www.minidesk.me";
        navigator.clipboard.writeText(linkToCopy);
        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 1500);
    };

    return (
        <>
            <Typography variant="h6" sx={{
                textTransform: "uppercase",
            }} gutterBottom>
                How to set Tiny Desk as Homepage for Chrome
            </Typography>
            <ol>
                <li>
                    <Typography sx={{ flexGrow: 1 }} variant="body1">
                        Go to{' '}
                        <a
                            href="https://chrome.google.com/webstore/category/extensions"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                            https://chrome.google.com/webstore/category/extensions
                        </a>
                    </Typography>
                </li>
                <li>
                    <Typography sx={{ marginTop: 3 }} variant="body1">
                        Search for &quot;Mini Desk&quot;
                    </Typography>
                </li>
                <li>
                    <Typography sx={{ marginTop: 3 }} variant="body1">
                        Click &quot;Add to Chrome&quot;
                    </Typography>
                </li>
            </ol>

            <Box display="flex" alignItems="center" justifyContent={'left'} gap={1} mt={2}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1, marginTop: 1.5 }}>
                        https://www.minidesk.me
                    </Typography>
                    <button
                        onClick={handleCopy}
                        style={{
                            borderRadius: '5px',
                            background: 'transparent',
                            cursor: 'pointer',
                            gap: '5px',
                            color: '#000',
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

            {/* Removed url attribute, keeping only src */}
            <img src={GUIImage} alt="" style={{ width: '100%' }} />
        </>
    );
}
