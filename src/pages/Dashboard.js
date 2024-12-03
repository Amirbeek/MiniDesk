import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;

                const response = await axios.get('http://localhost:5000/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data.user);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {userData ? (
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Surname:</strong> {userData.surname}</p>
                    <p><strong>Country:</strong> {userData.country}</p>
                </div>

            ) : (
                <p>Loading...</p>
            )}

        </div>
    );

};

export default Dashboard;
