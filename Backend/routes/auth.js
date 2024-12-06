    const express = require('express');
    const router = express.Router();
    const auth=  require('../controllers/auth')
    const authenticate=require('../middlewares/authenticate');

    // const {} = require('express-validator');

    // TO DO:1 for each auth router validator has to be added
    // and this result has to be connected with controller with:  const { validationResult} = require('express-validator')

    router.post('/signup', auth.postSignup);

    router.post('/activate/:token', auth.activateAccount);

    router.post('/login', auth.postLogin)

    router.post('/reset-password', auth.getResitPasswordEmail)

    router.post('/reset-password/:token', auth.postResetPassword)

    router.post('/recent-activation', auth.resendActivationEmail)

    router.delete('/delete',authenticate, auth.DeleteAccount);

    module.exports = router;