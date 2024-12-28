import React from "react";
import { Menu, MenuItem } from "@mui/material";

const ContextMenu = ({mousePos, onClose, menuItems = [],}) => (
    <Menu
        keepMounted
        open={Boolean(mousePos.mouseY)}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={
            mousePos.mouseY && mousePos.mouseX
                ? { top: mousePos.mouseY, left: mousePos.mouseX }
                : undefined
        }
    >
        {menuItems.map(({ label, onClick, icon }, index) => (
            <MenuItem
                key={index}
                onClick={() => {
                    onClick();
                    onClose();
                }}
                style={{ color: "#EB5757" }}
            >
                {icon && React.cloneElement(icon, { style: { marginRight: 8 } })}
                {label}
            </MenuItem>
        ))}
    </Menu>
);

export default ContextMenu;
