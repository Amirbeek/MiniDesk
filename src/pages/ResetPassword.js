import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import Navbar from "../sections/Navbar";
import useApi from "../useApi";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiCall = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const data = await apiCall({
                endpoint: `auth/reset-password/${token}`,
                method: 'POST',
                body: { password },
            });

            setMessage(data.message);
            navigate('/login');
        } catch (error) {
            setMessage(error.message || 'Reset failed');
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
                        Reset Your Password
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="New Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
