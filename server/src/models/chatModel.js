const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId }, { type: mongoose.Schema.Types.ObjectId }],
}, {
    timestamps: true
})

module.exports = mongoose.model('Chat', chatSchema)