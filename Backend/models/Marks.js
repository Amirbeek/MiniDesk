const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    title: String,
    marks: [
        {
            link: String,
            title: String
        }
    ],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

},{ timestamps: true });

module.exports = mongoose.model('Marks', bookmarkSchema);
