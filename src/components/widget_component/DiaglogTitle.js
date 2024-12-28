import styled from "styled-components";

const Title = styled.h2`
    margin: 0;
    font-weight: bold;
`

function DialogTitle({children}) {
    return <Title>{children}</Title>
}

export default DialogTitle