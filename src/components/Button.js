import styled from "styled-components";
import { Button } from '@mui/material';

const ButtonStyle = styled(Button)`
    background: transparent;
    color: black!important;
    &:hover {
        background: #cccccc;
    }
`
export default Button