require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const cors = require("cors");
const dashboard = require('./routes/dashboard');
const auth2 =require('./auth2')
require('./auth2')

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use((error, req, res,next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data:data
    })
})


// MongoDB connection and starting the server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api', dashboard)


app.get('/auth/google',auth2.AuthGoogle);
app.get('/auth/google/callback', auth2.AuthGoogleCallBack);
app.post('/auth/google', auth2.postAuth);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
