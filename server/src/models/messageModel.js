const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth'
    },
    message: { type: String, required: true }
}, {
    timestamps: true
})

module.exports = mongoose.model('Message', messageSchema);