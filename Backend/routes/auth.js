    const express = require('express');
    const router = express.Router();
    const auth=  require('../controllers/auth')
    const authenticate=require('../middlewares/authenticate');

    router.post('/signup', auth.postSignup);

    router.post('/activate/:token', auth.activateAccount);

    router.post('/login', auth.postLogin)

    router.post('/reset-password', auth.getResitPasswordEmail)

    router.post('/reset-password/:token', auth.postResetPassword)

    router.post('/recent-activation', auth.resendActivationEmail)

    router.delete('/delete',authenticate, auth.DeleteAccount);

    module.exports = router;