const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Email credentials from environment variables
const myEmail = process.env.My_Email;
const password = process.env.MyPassword;

// Nodemailer transport configuration
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: myEmail,
        pass: password,
    },
});

exports.postSignup = async (req, res) => {
    const { username, email, name, surname, country, password } = req.body;
    try {
        // Check if the username or email is already taken
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already taken' });
        }

        // Create a new user
        const user = new User({
            username,
            email,
            name,
            surname,
            country,
            password,
            isActive: false,
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        user.activationToken = token;
        await user.save();

        await transport.sendMail({
            from: myEmail,
            to: email,
            subject: 'Activate your account',
            html: `
                <h1>Welcome to Our Platform</h1>
                <p>Please click the link below to activate your account:</p>
                <a href="${process.env.CLIENT_URL}/activate/${token}">Activate Account</a>
            `,
        });

        return res.status(201).json({ message: 'Signup successful! Check your email to activate your account.', token });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

exports.activateAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || user.activationToken !== token) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        user.isActive = true;
        user.activationToken = null;
        await user.save();

        return res.status(200).json({ message: 'Account activated successfully' });
    } catch (error) {
        console.error('Error during account activation:', error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

exports.postLogin = async (req, res) => {
    const { username_or_email, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ username: username_or_email }, { email: username_or_email }],
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(400).json({ message: 'Account not activated. Please check your email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        user.isLogin = true
        user.save()
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: 'Login successful', token:token, user:user });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

exports.LogOut = async (req, res) => {
    const { token } = req.params;
    try{
        const user = await User.findOne()
    }catch(error){
        console.error('Error during logOut:', error);
    }
}
exports.getResitPasswordEmail = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.resetPasswordToken = token;
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await transport.sendMail({
            from: process.env.My_Email,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>Please click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
            `,
        });

        return res.status(200).json({ message: 'Password reset link sent to your email', token });
    } catch (err) {
        console.error('Error during password reset email:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

exports.postResetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            _id: decoded.userId,
            resetPasswordToken: token,
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = null;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully!' });
    } catch (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

exports.resendActivationEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isActive) {
            return res.status(400).json({ message: 'Your account is already activated' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        user.activationToken = token;
        await user.save();

        await transport.sendMail({
            from: myEmail,
            to: email,
            subject: 'Activate your account',
            html: `
                <h1>Welcome to Our Platform</h1>
                <p>Please click the link below to activate your account:</p>
                <a href="${process.env.CLIENT_URL}/activate/${token}">Activate Account</a>
            `,
        });

        return res.status(200).json({ message: 'Activation email has been sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error during resending activation email:', error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};
