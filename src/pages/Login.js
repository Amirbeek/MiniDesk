import React from 'react';
import { useNavigate } from 'react-router-dom';
import {TextField, Button, Grid, Typography, Box, Container} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../sections/Navbar";

const LoginForm = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username_or_email: Yup.string().required('Username or Email is required'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', values);
            toast.success(response.data.message);
            navigate('/dashboard');
            localStorage.setItem('authToken', response.data.token);
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container >
            <Navbar/>
            <Grid container spacing={8}>
                <Grid item xs={12} md={12}>
                    <Box display="flex" justifyContent='center'  alignItems="center" height="80vh" bgcolor="background.default">
                        <Box bgcolor="background.paper" borderRadius={2} p={3} boxShadow={3} width={420}>
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
                                                        as={TextField}
                                                        fullWidth
                                                        label={field === 'username_or_email' ? 'Username or Email' : 'Password'}
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
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Logging In...' : 'Log In'}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12} container justifyContent="space-between">
                                                <Button
                                                    variant="text"
                                                    onClick={() => navigate('/resend-activation-email')}
                                                >
                                                    Resend Activation Code
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    onClick={() => navigate('/reset-password-request')}
                                                >
                                                    Forgot Password?
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
                    </Box>

                    </Grid>
                <Grid item xs={12} md={6}>
                </Grid>
            </Grid>

        </Container>
    );
};

export default LoginForm;
