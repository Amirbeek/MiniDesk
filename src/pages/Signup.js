import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box, Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../sections/Navbar";
import useApi from "../useApi";

const SignupForm = () => {
    const navigate = useNavigate();
    const apiCall = useApi();

    const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France','UZB'];

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
            const data = await apiCall({
                endpoint: 'auth/signup',
                method: 'POST',
                body: values,
            });

            toast.success(data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Signup failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <Navbar />
            <Grid container spacing={8}>
                <Grid item xs={12} md={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="80vh" bgcolor="background.default">
                        <Box bgcolor="background.paper" borderRadius={2} p={3} boxShadow={3} width={420}>
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
                                                        as={TextField}
                                                        fullWidth
                                                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                                                        variant="outlined"
                                                        name={field}
                                                        type={field === 'password' ? 'password' : 'text'}
                                                        onChange={handleChange}
                                                        value={values[field]}
                                                    />
                                                    <ErrorMessage name={field} component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.3rem' }} />
                                                </Grid>
                                            ))}

                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="country-label">Country</InputLabel>
                                                    <Select
                                                        labelId="country-label"
                                                        name="country"
                                                        value={values.country}
                                                        onChange={handleChange}
                                                        label="Country"
                                                    >
                                                        {countries.map((country) => (
                                                            <MenuItem key={country} value={country}>
                                                                {country}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <ErrorMessage name="country" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.3rem' }} />
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12} container justifyContent="space-between">
                                                <Button
                                                    variant="text"
                                                    onClick={() => navigate('/')}
                                                >
                                                    Go Back Home
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    onClick={() => navigate('/login')}
                                                >
                                                    Log In
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
        </Container>
    );
};

export default SignupForm;
