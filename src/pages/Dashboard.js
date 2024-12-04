import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from "../components/Calendar";
import Settings from "../components/Settings";

const Dashboard = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

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
                    <Settings UserInfo={userData} />
                    <Calendar EventData={userData['events']} />
                </div>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    );

};

export default Dashboard;
