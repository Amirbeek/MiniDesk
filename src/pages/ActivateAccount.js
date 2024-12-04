import React, { useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';
import { Button, Typography, CircularProgress, Box } from '@mui/material';
import backgroundImage from '../backround_images/background.png';

const theme = {
    whiteColor: 'hsl(0, 0%, 100%)',
    blackColor: 'hsl(0, 0%, 0%)',
    borderColor: 'hsla(0, 0%, 100%, 0.7)',
    backgroundBlur: 'hsla(0, 0%, 100%, 0.01)',
    borderRadius: '1rem',
};

const Background = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(${backgroundImage}) no-repeat center center/cover;
`;

const ActivationContainer = styled(Box)`
    background-color: ${(props) => props.theme.backgroundBlur};
    border: 2px solid ${(props) => props.theme.borderColor};
    padding: 2.5rem 1.5rem;
    border-radius: ${(props) => props.theme.borderRadius};
    backdrop-filter: blur(16px);
    color: ${(props) => props.theme.whiteColor};
    text-align: center;
    max-width: 420px;
    width: 100%;
    @media (max-width: 600px) {
        padding: 1rem;
        max-width: 90%;
        border: 0px;
    }
`;

const StyledButton = styled(Button)`
    background-color: ${(props) => props.theme.whiteColor} !important;
    color: ${(props) => props.theme.blackColor} !important;
    border-radius: ${(props) => props.theme.borderRadius};
    font-weight: bold;
`;

const ActivateAccount = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleActivate = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/activate/${token}`);
            setMessage(response.data.message);
            navigate('/login')
        } catch (error) {
            setMessage(error.response?.data?.message || 'Activation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Background>
                <ActivationContainer>
                    <Typography variant="h4" gutterBottom>
                        Activate Your Account
                    </Typography>
                    {loading ? (
                        <CircularProgress style={{ color: theme.whiteColor }} />
                    ) : (
                        <StyledButton
                            onClick={handleActivate}
                            variant="contained"
                            fullWidth
                            disabled={loading}
                        >
                            Activate Account
                        </StyledButton>
                    )}
                    {message && (
                        <Typography
                            variant="body2"
                            style={{
                                marginTop: '1rem',
                                color: message.includes('successfully') ? 'green' : 'red',
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                </ActivationContainer>
            </Background>
        </ThemeProvider>
    );
};

export default ActivateAccount;
