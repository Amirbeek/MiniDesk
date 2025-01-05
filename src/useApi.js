import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useApi = () => {
    const navigate = useNavigate();
    const URL = process.env.REACT_APP_BACKEND_URL ;
    const token = localStorage.getItem("authToken");
    const apiCall = useCallback(async ({ endpoint, method, body }) => {
        const url = `${URL}/api/${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(body)
            });
            if (response.status === 401) {
                localStorage.removeItem("authToken");
                navigate('/');
                return;
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred');
            return data;
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }, [token, navigate]);

    return apiCall;
};

export default useApi;
