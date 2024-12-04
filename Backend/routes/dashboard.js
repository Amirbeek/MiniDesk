const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboard');
const authenticate = require('../middlewares/authenticate');

router.get('/dashboard', authenticate, dashboard.getUserInfo);

router.post('/event', authenticate, dashboard.postEvent);

router.put('/event/:eventId', authenticate, dashboard.UpdateEvent);

router.delete('/event/:eventId', authenticate, dashboard.DeleteEvent);

module.exports = router;
