import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, CircularProgress, Box } from '@mui/material';
import Navbar from "../sections/Navbar";
import useApi from "../useApi";

const ActivateAccount = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const apiCall = useApi();

    const handleActivate = async () => {
        setLoading(true);
        setMessage('');

        try {
            const data = await apiCall({
                endpoint: `auth/activate/${token}`,
                method: 'POST',
            });

            setMessage(data.message);
            navigate('/login');
        } catch (error) {
            setMessage(error.message || 'Activation failed');
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
                        Activate Your Account
                    </Typography>
                    {loading ? (
                        <CircularProgress sx={{ color: '#1976d2', display: 'block', margin: '0 auto' }} />
                    ) : (
                        <Button
                            onClick={handleActivate}
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: 1, fontWeight: 'bold' }}
                        >
                            Activate Account
                        </Button>
                    )}
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

export default ActivateAccount;
