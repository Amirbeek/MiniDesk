import styled from "styled-components";

const DetailsContainer = styled.div`
    width: 70%; 
    height: 60vh;  
    overflow-y: auto;     
    padding: 20px;      
    display: flex;
    flex-direction: column;
    gap: 10px;              
    position: relative;
    &::-webkit-scrollbar {
        width: 3px;
        height: 0;
    }

    &::-webkit-scrollbar-thumb {
        background: transparent;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }
    scrollbar-width: thin;
    scrollbar-color: #eeeeee transparent;
`;
function DialogDetailsContainer({children}) {
    return <DetailsContainer>{children}</DetailsContainer>
}
export default DialogDetailsContainer;