import { useCallback } from 'react';

const useApi = () => {
    const token = localStorage.getItem("authToken");
    const apiCall = useCallback(async ({ endpoint, method, body }) => {
        const url = `http://localhost:5000/api/${endpoint}`;
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
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred');
            return data;
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }, [token]);
    return apiCall;
};

export default useApi;
