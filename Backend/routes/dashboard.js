const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboard');
const authenticate = require('../middlewares/authenticate');

router.get('/dashboard', authenticate, dashboard.getUserInfo);

router.post('/event', authenticate, dashboard.postEvent);

router.put('/event/:eventId', authenticate, dashboard.UpdateEvent);

router.delete('/event/:eventId', authenticate, dashboard.DeleteEvent);

router.post('/notes' ,authenticate, dashboard.PostNote)

router.put('/notes/:noteId',authenticate, dashboard.PutNote)

router.delete('/notes/:noteId',authenticate, dashboard.DeleteNote);

router.post('/todo', authenticate, dashboard.PostTodo)

router.put('/todo/:todoId', authenticate, dashboard.PutTodo)

router.delete('/todo/:todoId', authenticate, dashboard.DeleteTodo)

module.exports = router;
