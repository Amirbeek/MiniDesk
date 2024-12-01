    const express = require('express');
    const router = express.Router();
    const User = require('../models/User');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const auth=  require('../controlers/auth')


    // Register route
    router.post('/signup', auth.postSignup);

    router.post('/activate/:token', auth.activateAccount);

    router.post('/login', auth.postLogin)

    router.post('/reset', auth.getResitPasswordEmail)

    router.post('/reset-password', auth.postResetPassword)

    module.exports = router;