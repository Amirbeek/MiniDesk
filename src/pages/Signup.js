import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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
        padding: 0; // Smaller padding for small screens
        max-width: 90%; // Adjust width on smaller screens
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
        font-size: 0.9rem; // Make text size smaller for mobile
    }
`;

const StyledError = styled.div`
    color: red;
    font-size: 0.8rem;
    margin-top: 0.3rem;
    @media (max-width: 600px) {
        font-size: 0.7rem; // Smaller error message on small screens
    }
`;

const SignupForm = () => {
    const navigate = useNavigate();

    // Country options (could be fetched from an API as well)
    const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France'];

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required').min(3, 'Must be at least 3 characters'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        name: Yup.string().required('Name is required'),
        surname: Yup.string().required('Surname is required'),
        country: Yup.string().required('Country is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', values);
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Background>
                <FormContainer>
                    <Typography variant="h4" align="center" gutterBottom>
                        Create an Account
                    </Typography>
                    <Formik
                        initialValues={{
                            username: '',
                            email: '',
                            name: '',
                            surname: '',
                            country: '',
                            password: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, handleChange, values }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    {['username', 'email', 'name', 'surname', 'password'].map((field) => (
                                        <Grid item xs={12} key={field}>
                                            <Field
                                                as={StyledTextField}
                                                fullWidth
                                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                                variant="outlined"
                                                name={field}
                                                type={field === 'password' ? 'password' : 'text'}
                                                onChange={handleChange}
                                                value={values[field]}
                                            />
                                            <ErrorMessage name={field} component={StyledError} />
                                        </Grid>
                                    ))}

                                    {/* Country Dropdown */}
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="country-label" style={{ color: theme.whiteColor }}>
                                                Country
                                            </InputLabel>
                                            <Select
                                                labelId="country-label"
                                                name="country"
                                                value={values.country}
                                                onChange={handleChange}
                                                label="Country"
                                                sx={{
                                                    color: theme.whiteColor, // Text color
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: theme.borderColor, // Border color
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: theme.whiteColor, // Border color on hover
                                                    },
                                                }}
                                            >
                                                {countries.map((country) => (
                                                    <MenuItem key={country} value={country}>
                                                        {country}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                            <ErrorMessage name="country" component={StyledError} />
                                        </FormControl>
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
                                            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} container justifyContent="space-between">
                                        <Button
                                            variant="text"
                                            style={{ color: theme.whiteColor }}
                                            onClick={() => navigate('/')} // Navigate to home
                                        >
                                            Go Back Home
                                        </Button>
                                        <Button
                                            variant="text"
                                            style={{ color: theme.whiteColor }}
                                            onClick={() => navigate('/login')} // Navigate to login page
                                        >
                                            Log In
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

export default SignupForm;
