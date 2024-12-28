import React from "react";
import styled from "styled-components";
const StyledComponent = styled.div`
    text-align: center;
    margin-top: 50px;
    
`
export default function UnSelected({children}) {
    return <StyledComponent>
        <span>{children}</span>
    </StyledComponent>
}