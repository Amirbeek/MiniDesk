import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <GoogleOAuthProvider clientId={clientId}>
        <App />
    </GoogleOAuthProvider>
);
