import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import backgroundImage from '../backround_images/background.png';
import {useNavigate} from "react-router-dom";

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

const StyledError = styled.div`
    color: red;
    font-size: 0.8rem;
    margin-top: 0.3rem;
    @media (max-width: 600px) {
        font-size: 0.7rem;
    }
`;

const RequestPasswordReset = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', values);
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || 'Password reset failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Background>
                <FormContainer>
                    <Typography variant="h4" align="center" gutterBottom>
                        Reset Your Password
                    </Typography>
                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, handleChange, values }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            as={StyledTextField}
                                            fullWidth
                                            label="Email"
                                            variant="outlined"
                                            name="email"
                                            type="email"
                                            onChange={handleChange}
                                            value={values.email}
                                        />
                                        <ErrorMessage name="email" component={StyledError} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={isSubmitting}
                                            style={{
                                                backgroundColor: theme.whiteColor,
                                                color: theme.blackColor,
                                                borderRadius: theme.borderRadius,
                                            }}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="text"
                                            style={{ color: theme.whiteColor }}
                                            onClick={() => navigate('/')} // Navigate to signup page
                                        >
                                            Go Back Home
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </FormContainer>
            </Background>
        </ThemeProvider>
    );
};

export default RequestPasswordReset;
