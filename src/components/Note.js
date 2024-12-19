import React from "react";
import "draft-js/dist/Draft.css";
import styled from "styled-components";
import {Grid} from "@mui/material";
const Container = styled.div`
    font-family: "Inter", sans-serif;
    padding: 40px;
`
const BorderedBox = styled(Grid)`
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    height: 60vh;
`
export default function MyEditor() {

    return (
        <Container>
            <h2>Notes Widget</h2>
            <Grid container spacing={2} >
                <BorderedBox item xs={3}>

                </BorderedBox>
                <Grid item xs={9}>

                </Grid>
            </Grid>
        </Container>
    );
}
