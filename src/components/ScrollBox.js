import React, { useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import styled from "styled-components";

// Styled component for the Scrollbar
const ScrollbarStyle = styled(Scrollbar)`
    width: 100% !important;
    height: 100px !important;
    position: fixed;
    bottom: 0px;
`;

const HorizontalScrollBox = () => {
    useEffect(() => {
        const container = document.getElementById('container'); // Selecting the container by id
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('p');
            p.textContent = `Item ${i + 1}`;
            container.appendChild(p);
        }
    }, []);

    return (
        <ScrollbarStyle
            horizontal={true}
            noScrollX={false}
            noScrollY={true}
            thumbX={false}
            thumbY={false} // Hide the vertical scrollbar thumb
        >
            <div id="container" style={{ display: 'flex', width: 'auto' }}>

            </div>
        </ScrollbarStyle>
    );
};

export default HorizontalScrollBox;
