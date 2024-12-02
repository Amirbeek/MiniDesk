import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    // Handle logout
    const logout = async () => {

        localStorage.removeItem('authToken'); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <header style={{ marginBottom: '20px' }}>
                <h1>Welcome to Your Desktop!</h1>
                <p>You're logged in, and this page is protected.</p>
            </header>

            <section style={{ marginBottom: '20px' }}>
                <h2>Your Dashboard</h2>
                <p>This is where your content would go.</p>
            </section>

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
