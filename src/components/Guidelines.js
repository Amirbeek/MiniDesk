import UnicornIcon from "./widget_component/Unicorn";
import * as React from "react";
import SettingButton from "./SettingButton";
import { Dialog, Box } from "@mui/material";
import { useState } from "react";
import DialogHeader from "./widget_component/DialogHeader";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabPanel1 from "./TabPanel1";
import styled from "styled-components";
import TabPanel2 from "./TabPanel2";
import TabPanel3 from "./TabPanel3";

// Styled Component for Tabs
const TabStyle = styled(Tab)`
    box-sizing: border-box;
    &:hover {
        background-color: transparent !important;
    }
`;

export default function Guidelines() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [value, setValue] = useState("1");

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);
    const handleChange = (event, newValue) => setValue(newValue);

    return (
        <>
            {/* Setting Button */}
            <SettingButton
                size="large"
                aria-label="Setting"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleOpenDialog}
            >
                <div className="hop">
                    <UnicornIcon />
                </div>
            </SettingButton>

            {/* Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    style: { maxHeight: "80vh", overflow: "hidden" },
                }}
            >
                {/* Dialog Header */}
                <DialogHeader title="Guidelines" onClose={handleCloseDialog} />

                {/* Tabs and Tab Panels */}
                <TabContext value={value}>
                    {/* Tabs */}
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            position: "sticky",
                            top: 0,
                            backgroundColor: "white",
                            zIndex: 1000,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <TabList onChange={handleChange} aria-label="Guidelines Tabs" variant="scrollable" centered >
                            <TabStyle label="Extension" value="1" />
                            <TabStyle label="Chrome" value="2" />
                            <TabStyle label="FireFox" value="3" />
                        </TabList>
                    </Box>

                    {/* Tab Panels */}
                    <Box sx={{ padding: 2, overflowY: "auto", maxHeight: "calc(80vh - 50px)" }}>
                        <TabPanel value="1">
                            <TabPanel1 />
                        </TabPanel>
                        <TabPanel value="2">
                            <TabPanel2/>
                        </TabPanel>
                        <TabPanel value="3">
                            <TabPanel3/>
                        </TabPanel>
                    </Box>
                </TabContext>
            </Dialog>
        </>
    );
}
