import styled from "styled-components";


const Wrapper = styled.div`
    width: 100%;
    height: 150px;
    background-color: hsla(0,0%,100%,.6);
    border-radius: 10px;
`
const Header = styled.header`
    background-color: #e77f23;
    width: 100%;
    padding: 7px 13px;
    color: white;
    border-radius: 10px 10px 0 0 ;
    font-weight: 500;
    box-sizing: border-box; 
    
    text-align: left;

`
const Body = styled.div`
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    color: #4f4f4f;
`

function ComponentButton({header='To Do', HeaderColor, children }){
    return<>
        <Wrapper>
            <Header style={{backgroundColor: HeaderColor}}>
                {header}
            </Header>
            <Body>
                {children}
            </Body>
        </Wrapper>
    </>
}

export default ComponentButton