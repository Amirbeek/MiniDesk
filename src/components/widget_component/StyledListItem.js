import styled from 'styled-components';
import { ListItem } from '@mui/material';

const StyledListItem = styled(ListItem)`
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 5px 0;
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

export default StyledListItem;
