import styled from "styled-components";

const SettingButton =  styled.button`
    background-color: hsla(0, 0%, 100%, .4);
    border: 1px solid hsla(0, 0%, 100%, .2);
    box-shadow: 0 0 .5rem 0 rgba(0, 0, 0, .1);
    border-radius: 15px;
    color: #4F4F4F;
    padding: 0.7rem .8rem .5rem .8rem;
    &:active {
        background-color: hsla(0, 0%, 100%, 0.75);
    }

    &:hover {
        background-color: hsla(0, 0%, 100%, 0.75);
    }
`
export default SettingButton;