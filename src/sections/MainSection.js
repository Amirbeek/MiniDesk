import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import Bimage from '../background_images/Bimage.png';
import { useNavigate } from 'react-router-dom';

const GoogleButtonStyle = styled.button`
    padding: 10px;
    font-weight: bolder;
    font-size: 20px;
    color: #5e17eb;
    gap: 6px;
    border: 2px solid #5e17eb;
    border-radius: 0;
    transition: background-color 0.3s, color 0.3s;
    background-color: transparent;

    &:hover, &:focus {
        background-color: #5e17eb;
        color: #fff;
    }
`;

const AboutContainer = styled.div`
    padding: 100px;
    text-align: left;

    h1 {
        color: #000;
        line-height: 72px;
        margin-top: 18px;
        margin-bottom: 10px;
        font-size: 60px;
        font-weight: 700;

        span {
            color: #5e17eb;
        }
    }

    @media (max-width: 768px) {
        padding: 40px 20px;

        h1 {
            font-size: 36px;
            line-height: 1.1;
        }
    }
`;

const navigateToUrl = (url) => {
    window.location.href = url;
};

const auth = async () => {
    const URL = process.env.REACT_APP_BACKEND_URL;
    console.log(URL);

    try {
        const response = await fetch(`${URL}/request`, { method: 'GET' });
        const data = await response.json();

        if (data.url) {
            navigateToUrl(data.url);
        } else {
            console.error('Failed to retrieve Google OAuth URL');
        }
    } catch (error) {
        console.error('Error during authentication:', error);
    }
};


const About = () => {
    const [currentText, setCurrentText] = useState('design');
    const navigate = useNavigate();

    useEffect(() => {
        const texts = ['organize', 'manage', 'prioritize'];

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        let index = 0;
        const interval = setInterval(() => {
            setCurrentText(texts[index]);
            index = (index + 1) % texts.length;
        }, 1300);

        if (token) {
            localStorage.setItem('authToken', token);
            navigate('/dashboard');
        }

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <AboutContainer>
                    <h1>
                        Welcome to MiniDesk
                        <br />
                        <span>{currentText}</span> your productivity companion
                    </h1>
                    <GoogleButtonStyle type="button" onClick={auth}>
                        Sign in with Google
                    </GoogleButtonStyle>
                </AboutContainer>
            </Grid>
            <Grid item xs={12} md={6}>
                <img src={Bimage} alt="Mini Desk Overview" style={{ width: '100%', borderRadius: '10px' }} />
            </Grid>
        </Grid>
    );
};

export default About;
