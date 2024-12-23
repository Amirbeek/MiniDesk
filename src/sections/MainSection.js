import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AnimatedSection from '../components/AnimatedSection';
import { Grid } from "@mui/material";

const AboutContainer = styled.div`
    padding: 100px 100px;
    text-align: left;

    h1 {
        color: #000;
        line-height: 72px;
        margin-top: 18px;
        font-size: 60px;
        font-weight: 700;
        span {
            color: #5e17eb;
        }
    }

    p {
        font-size: 1.2rem;
        max-width: 800px;
        line-height: 1.6;
        font-weight: 700;
    }

    @media (max-width: 768px) {
        padding: 40px 20px;

        h1 {
            font-size: 36px;
            line-height: 1.1;
        }

        p {
            font-size: 0.9rem;
        }
    }
`;

const FaceColor = styled.span`
    color: ${props => props.theme.primary_color} !important;
`;

const About = () => {
    const [currentText, setCurrentText] = useState("design");

    useEffect(() => {
        const texts = ["Organize", "Create", "Manage"];
        let index = 0;
        const interval = setInterval(() => {
            setCurrentText(texts[index]);
            index = (index + 1) % texts.length;
        }, 1300);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatedSection >
            <Grid container spacing={2} >
                <Grid item xs={12} md={6}>
                    <AboutContainer>
                        <h1>
                            Welcome to MiniDesk
                            <br />
                            <FaceColor>{currentText}</FaceColor> your productivity companion
                        </h1>
                    </AboutContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    {/* Placeholder for image or additional content */}
                    <img src={require('../backround_images/Bimage.png')} alt="Mini Desk Overview" style={{ width: '100%', borderRadius: '10px' }} />
                </Grid>
            </Grid>
        </AnimatedSection>
    );
};

export default About;
