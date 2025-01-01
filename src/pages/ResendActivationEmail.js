import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import Navbar from "../sections/Navbar";
import useApi from "../useApi";

const ResendActivationEmail = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const apiCall = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const data = await apiCall({
                endpoint: 'auth/recent-activation',
                method: 'POST',
                body: { email },
            });
            setMessage(data.message);
        } catch (error) {
            setMessage(error.message || 'Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Navbar/>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Box sx={{ padding: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#fff', maxWidth: 400, width: '100%' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Resend Activation Email
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
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
                            sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: 1 }}
                        >
                            {loading ? 'Sending...' : 'Resend Activation Email'}
                        </Button>
                    </form>
                    {message && (
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{
                                marginTop: '1rem',
                                color: message.includes('successfully') ? 'green' : 'red',
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                </Box>
            </Box>

        </>
    );
};

export default ResendActivationEmail;
