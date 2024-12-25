const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, default: 'New Note' },
        content: { type: mongoose.Schema.Types.Mixed},
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notes', noteSchema);
