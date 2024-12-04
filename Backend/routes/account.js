const express = require('express');
const router = express.Router();
const account = require('../controllers/account');
const authenticate = require('../middlewares/authenticate');

router.get('/account', authenticate, account.getUserInfo);


module.exports = router;
