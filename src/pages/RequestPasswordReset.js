import React from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import Navbar from "../sections/Navbar";

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
        <>
        <Navbar/>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh',  }}>
                <Box sx={{ padding: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#fff', maxWidth: 400, width: '100%' }}>
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
                                            as={TextField}
                                            fullWidth
                                            label="Email"
                                            variant="outlined"
                                            name="email"
                                            type="email"
                                            onChange={handleChange}
                                            value={values.email}
                                        />
                                        <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.3rem' }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={isSubmitting}
                                            sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: 1 }}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="text"
                                            fullWidth
                                            onClick={() => navigate('/')}
                                            sx={{ color: '#1976d2' }}
                                        >
                                            Go Back Home
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Box>

        </>
    );
};

export default RequestPasswordReset;
