const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboard');
const authenticate = require('../middlewares/authenticate');

// Dashboard routes
router.get('/dashboard', authenticate, dashboard.getUserInfo);

// Event routes
router.post('/event', authenticate, dashboard.postEvent);
router.put('/event/:eventId', authenticate, dashboard.UpdateEvent);
router.delete('/event/:eventId', authenticate, dashboard.DeleteEvent);

// Note routes
router.post('/notes', authenticate, dashboard.PostNote);
router.put('/notes/reorder', authenticate, dashboard.NoteReorder)
router.put('/notes/:noteId', authenticate, dashboard.PutNote);
router.delete('/notes/:noteId', authenticate, dashboard.DeleteNote);

// Todo routes
router.post('/todo', authenticate, dashboard.PostTodo);
router.put('/todo/reorder', authenticate, dashboard.TodoOrder);
router.put('/todo/reorder/:todoId',authenticate, dashboard.TodoItemReOrder)
router.put('/todo/:todoId', authenticate, dashboard.PutTodo);
router.delete('/todo/:todoId', authenticate, dashboard.DeleteTodo);

// Mark routes
router.post('/mark', authenticate, dashboard.PostMark);
router.put('/mark/reorder', authenticate, dashboard.MarkOrder);
router.put('/mark/reorder/:markId',authenticate, dashboard.MarkItemReOrder)
router.put('/mark/:markId', authenticate, dashboard.PutMark);
router.delete('/mark/:markId', authenticate, dashboard.DeleteMark);

// Background Image routes
router.put('/image',authenticate, dashboard.PutBackgroundImage)

// Settings routes
router.put('/settings', authenticate, dashboard.PutAccountSettings)

module.exports = router;