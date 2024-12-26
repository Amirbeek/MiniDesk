import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupForm from './pages/Signup';
import LoginForm from './pages/Login';
import ResetPasswordRequest from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';
import ActivateAccount from './pages/ActivateAccount';
import ResendActivationEmail from "./pages/ResendActivationEmail";
import Dashboard from "./pages/Dashboard";
import Note from "./components/Note";
import Main from "./Main";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/dashboard" element={ <Dashboard /> } />
                <Route path='test' element={<Note />} />
                <Route path="/register" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/activate/:token" element={<ActivateAccount />} />
                <Route path="/resend-activation-email" element={<ResendActivationEmail />} />
            </Routes>
        </Router>
    );
}

export default App;
