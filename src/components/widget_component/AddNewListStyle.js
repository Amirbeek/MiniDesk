import styled from 'styled-components';
const AddNewListStyle = styled.div`
    cursor: pointer;
    height: ${({ itemCount }) =>
            itemCount === 0
                    ? "50vh"
                    : itemCount < 5
                            ? `${55 - itemCount * 10}vh`
                            : "50px"
    };
    flex-shrink: 0;
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: height 0.3s ease, background-color 0.3s ease;
`;

export default AddNewListStyle;
