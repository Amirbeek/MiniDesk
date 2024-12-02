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

    router.post('/reset-password', auth.getResitPasswordEmail)

    router.post('/reset-password/:token', auth.postResetPassword)

    router.post('/recent-activation', auth.resendActivationEmail)
    router()

    module.exports = router;