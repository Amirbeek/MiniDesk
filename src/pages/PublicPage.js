import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import backgroundImage from '../backround_images/background.png';

// Define a theme with your color variables
const theme = {
    whiteColor: 'hsl(0, 0%, 100%)',
    blackColor: 'hsl(0, 0%, 0%)',
    h1FontSize: '2rem',
};

const BackgroundImage = styled.div`
    background: url(${backgroundImage}) no-repeat center center fixed;
    background-size: cover;
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center;
    position: relative;
`;

const CardContainer = styled.div`
    position: relative;
    background-color: hsla(0, 0%, 100%, 0.01);
    border: 2px solid ${(props) => props.theme.whiteColor};
    padding: 2.5rem 1rem;
    color: ${(props) => props.theme.whiteColor};
    border-radius: 1rem;
    backdrop-filter: blur(16px);
    width: 100%;
    max-width: 420px;
`;

const Title = styled.h3`
    font-size: ${(props) => props.theme.h1FontSize};
    color: ${(props) => props.theme.whiteColor};
    margin-bottom: 1.25rem;
`;

function PublicPage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <ThemeProvider theme={theme}>
            <BackgroundImage>
                <Grid container spacing={0} justifyContent="center">
                    <Grid item xs={12} sm={4}>
                        <CardContainer>
                            <Title>
                                Already have an account? Log in with your email below.
                            </Title>
                            <Button variant="contained" onClick={handleLoginClick}>
                                Login
                            </Button>
                        </CardContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CardContainer>
                            <Title>
                                Are you new here? Sign in with your Google account or create a new account.
                            </Title>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Button variant="outlined" onClick={handleRegisterClick}>
                                        Sign up with Github
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" onClick={handleRegisterClick}>
                                        Create Account
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContainer>
                    </Grid>
                </Grid>
            </BackgroundImage>
        </ThemeProvider>
    );
}

export default PublicPage;
