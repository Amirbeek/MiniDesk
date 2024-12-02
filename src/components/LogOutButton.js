import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Dashboard() {
    const navigate = useNavigate();
    const logout = async () => {
        const response = await axios.post('http://localhost:5000/api/auth/logout', values);

        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>

            <button
                onClick={logout}
                style={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderRadius: '5px'
                }}
            >
                Logout
            </button>
        </div>
    );
}

export default Dashboard;
