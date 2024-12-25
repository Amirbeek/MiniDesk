const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, default: 'New Todo' },
        todos: [
            {
                text: { type: String, default: '' },
                done: { type: Boolean, default: false }
            }
        ],
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Todos', TodoSchema);