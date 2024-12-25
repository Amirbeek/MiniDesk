import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Grid } from "@mui/material";
import Bimage from '../backround_images/Bimage.png'; // Import image
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

const GoogleButtonStyle = styled.div`
    display: flex;
    justify-content: center;
    height: 100px;
    width: 300px;

    .nsm7Bb-HzV7m-LgbsSe-MJoBVe{

    }
    .google-sign-in-button {

        .nsm7Bb-HzV7m-Bz112c{
            display: none;
        }

        span {
            padding: 10px;
            font-weight: bolder;
            font-size: 20px;
            color: #5e17eb;
            gap: 6px;
            border: 2px solid #5e17eb;
            border-radius: 0px;
            transition-duration: .3s;
            &:hover {
                background-color: #5e17eb;
                color: #fff;
            }
        }
    }
`;

const AboutContainer = styled.div`
    padding: 100px 100px;
    text-align: left;
    .nsm7Bb-HzV7m-LgbsSe{
        width: 100%;
        padding: 0;
        height: 100%;
    }
    h1 {
        color: #000;
        line-height: 72px;
        margin-top: 18px;margin-bottom: 10px;
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

const About = () => {
    const [currentText, setCurrentText] = useState("design");
    const googleButtonRef = useRef(null);
    const navigate = useNavigate();  // Initialize useNavigate for redirecting

    useEffect(() => {
        const texts = ["Organize", "Create", "Manage"];
        let index = 0;
        const interval = setInterval(() => {
            setCurrentText(texts[index]);
            index = (index + 1) % texts.length;
        }, 1300);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        /* global google */
        if (window.google && googleButtonRef.current) {
            window.google.accounts.id.initialize({
                client_id: '431778205050-cjiijts61qdaof3a78eaufbf7pk8dpia.apps.googleusercontent.com',
                callback: (response) => {
                    const { credential } = response;
                    console.log('Google credential:', credential);

                    // Call your API to handle login with the credential
                    fetch(`http://localhost:5000/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: credential }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log('Login successful:', data);

                            // Save the JWT token in localStorage
                            localStorage.setItem('token', data.token);

                            // Redirect to the dashboard page
                            navigate('/dashboard');
                        })
                        .catch((error) => {
                            console.error('Login failed:', error);
                        });
                },
            });

            window.google.accounts.id.renderButton(googleButtonRef.current, {
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                width: 300,
            });
        }
    }, [navigate]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <AboutContainer>
                    <h1>
                        Welcome to MiniDesk
                        <br />
                        <span style={{ color: '#5e17eb' }}>{currentText}</span> your productivity companion
                    </h1>
                    <GoogleButtonStyle>
                        <div className="google-sign-in-button" ref={googleButtonRef}></div>
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
