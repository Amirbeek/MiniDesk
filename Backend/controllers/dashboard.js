const User = require('../models/User');
const Event = require('../models/Event');
const Note = require("../models/Notes");
const Todo = require('../models/Todos')
const Mark = require('../models/Marks')
const mongoose = require('mongoose');
exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('USER ID: ' , userId);
        const user = await User.findById(userId)
            .populate('events')
            .populate('todos')
            .populate('notes')
            .populate('marks')
            .lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('TODOS: ', user.todos)

        res.status(200).json({
            message: 'Welcome to your dashboard',
            user: {
                username: user.username,
                email: user.email,
                name: user.name,
                surname: user.surname,
                country: user.country,
                events: user.events,
                notes: user.notes,
                todos: user.todos,
                marks: user.marks,
                backgroundImage:user.backgroundImage,
                unicorn: user.unicorn
            },
        });
    } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
    }
};
exports.PutBackgroundImage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { backgroundImage } = req.body;
        if (!backgroundImage || typeof backgroundImage !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing backgroundImage' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.backgroundImage = backgroundImage;
        await user.save();

        res.status(200).json({
            message: 'Successfully updated background image!',
            backgroundImage,
        });
    } catch (err) {
        console.error('Error updating user background image:', err);
        res.status(500).json({
            message: 'Failed to update user background image',
            error: err.message,
        });
    }
};
exports.PutAccountSettings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { unicorn, country } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.unicorn = unicorn;

        if (country !== undefined && country !== null) {
            user.country = country;
        }

        await user.save();

        res.status(200).json({
            message: 'Successfully updated unicorn and country!',
        });
    } catch (err) {
        console.error('Error updating unicorn and country:', err);
        res.status(500).json({
            message: 'Failed to update unicorn and country!',
            error: err.message,
        });
    }
};
exports.postEvent = async (req, res) => {
    const userId = req.user.userId;
    const { subject, location, description, startTime, endTime, isAllDay, repeat, customRepeatInterval, timezone } = req.body;

    const event = new Event({
        subject,
        location,
        description,
        startTime,
        endTime,
        isAllDay,
        repeat,
        customRepeatInterval,
        timezone,
        creator: userId
    });

    try {
        await event.save();
        const user = await User.findById(userId);
        user.events.push(event);
        await user.save();

        res.status(201).json({
            message: "Event created successfully",
            eventId: event._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating event", error: err });
    }
};
exports.UpdateEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const eventId = req.params.eventId;

        const { subject, location, startTime, endTime, isAllDay, description } = req.body;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.creator.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized!' });
        }
        if (!subject || !location || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        event.subject = subject;
        event.location = location;
        event.startTime = new Date(startTime);
        event.endTime = new Date(endTime);
        event.isAllDay = isAllDay;
        event.description = description;

        // Save updated event
        await event.save();

        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (e) {
        console.error('Error updating event:', e);
        res.status(500).json({ message: 'Error updating event', error: e.message });
    }
};
exports.DeleteEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId).populate('creator');
        if (!event) {
            const error = new Error('Could not find event.');
            error.statusCode = 404;
            throw error;
        }
        if (event.creator._id.toString() !== userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        const user = await User.findById(userId);
        user.events.pull(eventId);
        await user.save();
        await Event.findByIdAndDelete(eventId);

        res.status(200).json({ message: 'Event deleted successfully', eventId });
    } catch (e) {
        console.error('Error deleting event:', e);
        res.status(e.statusCode || 500).json({ message: e.message || 'Error deleting event' });
    }
};
exports.PostNote = async function (req, res) {
    try {
        const userId = req.user.userId;
        const { title, content } = req.body;
        console.log("Post Note UserID: " + userId);
        console.log("data of Note: ", title, content);
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const note = new Note({
            title,
            content,
            creator: userId,
        });

        await note.save();

        const user = await User.findById(userId);
        user.notes.push(note);
        await user.save();

        res.status(201).json({
            message: "Note created successfully",
            note:{
                _id: note._id,
                title: note.title,
                content: note.content
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating note", error: err });
    }
};
exports.PutNote = async function (req, res) {
    try {
        const userId = req.user.userId;
        const noteId = req.params.noteId;
        let { title, content } = req.body;
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.creator.toString() !== userId) {
           title = 'New Note'
        }
        note.title = title;
        note.content = content;
        await note.save();

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (e) {
        console.error('Error updating Note:', e);
        res.status(500).json({ message: 'Error updating Note', error: e.message });
    }
};
exports.NoteReorder = async function (req, res) {
    try {
        const userId = req.user.userId;
        const { orderedNoteIds } = req.body;

        const areValidIds = orderedNoteIds.every(id => mongoose.Types.ObjectId.isValid(id));

        if (!areValidIds) {
            return res.status(400).json({ message: 'Invalid note ID(s) provided.' });
        }

        await User.findByIdAndUpdate(userId, {
            $set: { notes: orderedNoteIds }
        });

        res.json({ message: 'Notes reordered successfully.' });
    } catch (e) {
        res.status(500).json({ message: 'Error updating Order Note', error: e.message });
    }
}
exports.DeleteNote = async function (req, res) {
    try {
        const userId = req.user.userId;
        const noteId = req.params.noteId;
        const note = await Note.findById(noteId).populate('creator');
        if (note.creator._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized!' });
        }
        const user = await User.findById(userId);
        user.notes.pull(noteId);
        await user.save();
        await Note.findByIdAndDelete(noteId);

        res.status(200).json({ message: 'Note deleted successfully', noteId });
    } catch (e) {
        console.error('Error deleting Note:', e);
        res.status(500).json({ message: 'Error deleting Note', error: e.message });
    }
};
exports.PostTodo = async function (req, res) {
    try {
        const userId = req.user.userId;
        const { title, todos } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const defaultTodos = todos === undefined ? [{ text: "Sample Task", done: false, _id: Date.now().toString() }] : todos;

        const todo = new Todo({
            title,
            todos: defaultTodos,
            creator: userId,
        });

        await todo.save();
        const user = await User.findById(userId);
        user.todos.push(todo);
        await user.save();
        res.status(201).json({
            message: "Todo created successfully",
            todo: {
                _id: todo._id,
                title: todo.title,
                todos: todo.todos
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating todo", error: err });
    }
};
exports.PutTodo = async function (req, res) {
    const userId = req.user.userId;
    const todoId = req.params.todoId;
    const { title, todos } = req.body;
    try {
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        if (todo.creator.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to edit this todo' });
        }

        if (title) {
            todo.title = title;
        }
        if (todos) {
            const updatedTasks = todos.map(submittedTask => {
                if (submittedTask._id) {
                    const existingTask = todo.todos.id(submittedTask._id);
                    if (existingTask) {
                        existingTask.text = submittedTask.text ?? existingTask.text;
                        existingTask.done = submittedTask.done ?? existingTask.done;
                        return existingTask;
                    }
                } else {
                    return { text: submittedTask.text, done: submittedTask.done };
                }
            });

            todo.todos = updatedTasks.filter(task => task != null);
        }
        const updatedTodo = await todo.save();
        res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ message: 'Error updating todo', error: err.message });
    }
};
exports.TodoOrder = async function (req, res) {
    try {
        const userId = req.user.userId;
        const { orderedTodosIds } = req.body;

        const areValidIds = orderedTodosIds.every(id => mongoose.Types.ObjectId.isValid(id));

        if (!areValidIds) {
            return res.status(400).json({ message: 'Invalid todos ID(s) provided.' });
        }

        await User.findByIdAndUpdate(userId, {
            $set: { todos: orderedTodosIds }
        });

        res.json({ message: 'todos reordered successfully.' });
    } catch (e) {
        res.status(500).json({ message: 'Error updating Order todos', error: e.message });
    }
}
exports.TodoItemReOrder = async function(req, res) {
    try {
        const userId = req.user.userId;
        const todoId = req.params.todoId;
        const { tasks } = req.body;

        // Find the specific todo by userId and todoId
        const todo = await Todo.findOne({ _id: todoId, creator: userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }

        const reorderedTodos = tasks.map(task => {
            return todo.todos.find(todoTask => todoTask._id.toString() === task._id.toString());
        });

        // Ensure that the reordered tasks are updated
        todo.todos = reorderedTodos;

        // Save the updated todo
        await todo.save();

        res.json({ message: 'Tasks reordered successfully.', todo: todo.todos });
    } catch (e) {
        res.status(500).json({ message: 'Error updating task order', error: e.message });
    }
};
exports.DeleteTodo = async function (req, res) {
    try {
        const userId = req.user.userId;
        const todoId = req.params.todoId;
        const todo = await Todo.findById(todoId).populate('creator');

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.creator._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized!' });
        }

        const user = await User.findById(userId);
        user.todos.pull(todoId);
        await user.save();
        await Todo.findByIdAndDelete(todoId);
        res.status(200).json({ message: 'Todo deleted successfully', todoId });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ message: 'Error deleting todo', error: err.message });
    }
};
exports.PostMark = async function (req, res) {
    try {
        const userId = req.user.userId;
        const { title, marks } = req.body;

        // Validate title
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Create a new mark
        const newMark = new Mark({
            title,
            marks: marks || [], // Optional: provide marks or use an empty array
            creator: userId,
        });

        // Save the mark
        await newMark.save();

        // Update user's marks
        const user = await User.findById(userId);
        user.marks.push(newMark);
        await user.save();

        res.status(201).json({ message: 'Mark created successfully', mark: newMark });
    } catch (err) {
        console.error('Error creating mark:', err);
        res.status(500).json({ message: "Error creating mark", error: err.message });
    }
};
exports.PutMark = async function (req, res) {
    const userId = req.user.userId;
    const markId = req.params.markId;
    const { title, marks } = req.body;

    try {
        const mark = await Mark.findById(markId);
        if (!mark) {
            return res.status(404).json({ message: 'Mark not found' });
        }
        if (mark.creator.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to edit this mark' });
        }

        if (title) mark.title = title;

        if (marks) {
            mark.marks = marks.map((m) => {
                if (m._id && typeof m._id === 'string') {
                    return { ...m, _id: new mongoose.Types.ObjectId(m._id) };
                }
                return m;
            });
        }

        await mark.save();

        res.status(200).json({ message: 'Mark updated successfully', mark });
    } catch (err) {
        console.error('Error updating mark:', err);
        res.status(500).json({ message: 'Error updating mark', error: err.message });
    }
};
exports.MarkOrder = async function (req, res) {
    try {
        const userId = req.user.userId;
        const { orderedMarks } = req.body;

        const areValidIds = orderedMarks.every(id => mongoose.Types.ObjectId.isValid(id));

        if (!areValidIds) {
            return res.status(400).json({ message: 'Invalid Marks ID(s) provided.' });
        }

        await User.findByIdAndUpdate(userId, {
            $set: { marks: orderedMarks }
        });

        res.json({ message: 'Marks reordered successfully.' });
    } catch (e) {
        res.status(500).json({ message: 'Error updating Order Marks', error: e.message });
    }
};

exports.MarkItemReOrder = async function(req, res) {
    try {
        const userId = req.user.userId;
        const markId = req.params.markId;
        const { marks } = req.body;

        const mark = await Mark.findOne({ _id: markId, creator: userId });
        if (!mark) {
            return res.status(404).json({ message: 'Mark not found.' });
        }

        const reorderedMarks = marks.map(markItem => {
            return mark.marks.find(existingMark => existingMark._id.toString() === markItem._id.toString());
        });

        mark.marks = reorderedMarks;

        await mark.save();

        res.json({ message: 'Mark reordered successfully.', marks: mark.marks });
    } catch (e) {
        res.status(500).json({ message: 'Error updating Mark order', error: e.message });
    }
};



exports.DeleteMark = async function (req, res) {
    try {
        const userId = req.user.userId;
        const markId = req.params.markId;

        const mark = await Mark.findById(markId).populate('creator');
        if (!mark) {
            return res.status(404).json({ message: 'Mark not found' });
        }

        if (mark.creator._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized!' });
        }

        const user = await User.findById(userId);
        user.marks.pull(markId);
        await user.save();

        await Mark.findByIdAndDelete(markId);

        res.status(200).json({ message: 'Mark deleted successfully', markId });
    } catch (err) {
        console.error('Error deleting mark:', err);
        res.status(500).json({ message: 'Error deleting mark', error: err.message });
    }
};
