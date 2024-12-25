// App.js or index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Adjust the path if needed
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the GoogleOAuthProvider

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Replace with your Google Client ID

ReactDOM.render(
    <GoogleOAuthProvider clientId={clientId}>
        <App />
    </GoogleOAuthProvider>,
    document.getElementById('root')
);
