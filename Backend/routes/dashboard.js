const express = require('express');
const router = express.Router();
const dashboard=  require('../controlers/dashboard')
const authenticate = require('../middlewares/authenticate');


router.get('/dashboard',authenticate, dashboard.getUserInfo);

module.exports = router;