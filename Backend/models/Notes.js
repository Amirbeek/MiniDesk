const mongoose = require('mongoose');

// Use Mixed type for content to allow storing complex data such as JSON
const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, default: 'New Note' },
        content: { type: mongoose.Schema.Types.Mixed, required: true },  // This stores the serialized EditorState
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notes', noteSchema);
