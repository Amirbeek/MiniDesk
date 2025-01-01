import styled from 'styled-components';

const ItemWrapper = styled.div`
    flex-direction: column;
    align-items: center;
    padding: 10px;
    width: max-content;
    margin-right: 20px;
    background-color: ${props => props.isSelected ? 'hsla(0,0%,100%,0.85)' : 'hsla(0, 0%, 100%, .4)'};
    border: 1px solid hsla(0, 0%, 100%, .2);
    border-radius: 10px;
    box-shadow: 0 0 .5rem 0 rgba(0, 0, 0, .1);
    color: #333;
    transition: 0.3s;
    cursor: pointer;
`;

export default ItemWrapper;