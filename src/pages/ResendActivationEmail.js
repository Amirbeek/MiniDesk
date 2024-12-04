import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
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

const FormContainer = styled(Box)`
    background-color: ${(props) => props.theme.backgroundBlur};
    border: 2px solid ${(props) => props.theme.borderColor};
    padding: 2.5rem 1.5rem;
    border-radius: ${(props) => props.theme.borderRadius};
    backdrop-filter: blur(16px);
    color: ${(props) => props.theme.whiteColor};
    max-width: 420px;
    width: 100%;
    @media (max-width: 600px) {
        padding: 1rem;
        max-width: 90%;
        border: 0px;
    }
`;

const StyledTextField = styled(TextField)`
    & .MuiInputBase-input {
        color: ${(props) => props.theme.whiteColor};
    }
    & .MuiOutlinedInput-root {
        & fieldset {
            border-color: ${(props) => props.theme.borderColor};
        }
        &:hover fieldset {
            border-color: ${(props) => props.theme.whiteColor};
        }
    }
    & .MuiInputLabel-root {
        color: ${(props) => props.theme.whiteColor};
    }
`;

const ResendActivationEmail = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/recent-activation', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong. Please try again later.');
        }

        setLoading(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Background>
                <FormContainer>
                    <Typography variant="h4" align="center" gutterBottom>
                        Resend Activation Email
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <StyledTextField
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            margin="normal"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            style={{
                                backgroundColor: theme.whiteColor,
                                color: theme.blackColor,
                                borderRadius: theme.borderRadius,
                            }}
                        >
                            {loading ? 'Sending...' : 'Resend Activation Email'}
                        </Button>
                    </form>
                    {message && (
                        <Typography
                            variant="body2"
                            align="center"
                            style={{
                                marginTop: '1rem',
                                color: message.includes('successfully') ? 'green' : 'red',
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                </FormContainer>
            </Background>
        </ThemeProvider>
    );
};

export default ResendActivationEmail;
