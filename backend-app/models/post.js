const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    description: { type: String, required: true },
    link: { type: String, required: true },
    creator: {
        user: { type: String, required: true },
        email: { type: String, required: true }
    },
    createdAt: { type: Number, required: true },
    createdBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User'} //mapping with user
});

module.exports = mongoose.model('Post', postSchema);