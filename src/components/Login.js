import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
    @media (max-width: 600px) {
        font-size: 0.9rem;
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
const Active = styled.div`
    text-align: center;
    width: 100%;
    color: #c4c1c1;

    a {
        color: #fff;
    }
`
const LoginForm = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username_or_email: Yup.string().required('Username or Email is required'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login');
            alert(response.data.message);
            alert(response.data.user)
            localStorage.setItem('authToken', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Background>
                <FormContainer>
                    <Typography variant="h4" align="center" gutterBottom>
                        Log In to Your Account
                    </Typography>
                    <Formik
                        initialValues={{
                            username_or_email: '',
                            password: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, handleChange, values }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    {['username_or_email', 'password'].map((field) => (
                                        <Grid item xs={12} key={field}>
                                            <Field
                                                as={StyledTextField}
                                                fullWidth
                                                label={field === 'username_or_email' ? 'Username or Email' : 'Password'}
                                                variant="outlined"
                                                name={field}
                                                type={field === 'password' ? 'password' : 'text'}
                                                onChange={handleChange}
                                                value={values[field]}
                                            />
                                            <ErrorMessage name={field} component={StyledError} />
                                        </Grid>
                                    ))}

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
                                            {isSubmitting ? 'Logging In...' : 'Log In'}
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12} container justifyContent="space-between">
                                        <Button
                                            variant="text"
                                            style={{ color: theme.whiteColor }}
                                            onClick={() => navigate('/register')} // Navigate to signup page
                                        >
                                            Create an Account
                                        </Button>
                                        <Button
                                            variant="text"
                                            style={{ color: theme.whiteColor }}
                                            onClick={() => navigate('/reset-password-request')} // Navigate to reset password page
                                        >
                                            Forgot Password?
                                        </Button>
                                    </Grid>
                                    <Active>
                                        <span>if you have not receive activation <a
                                            href="/resend-activation-email"> E'mail</a></span>
                                    </Active>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </FormContainer>
            </Background>
        </ThemeProvider>
    );
};

export default LoginForm;
