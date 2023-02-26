const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

const getChatDetails = asyncHandler(async (req, res) => {
    const { receiverId, senderId } = req.params;
    if (!receiverId || !senderId) {
        throw new Error('Receiver Id and/or Sender Id is missing in params');
    }

    const chatData = await Chat.find({ users: { $all: [receiverId, senderId] } });

    const messageData = await Message.find({ chatId: chatData[0]._id })

    res.json({ chatData, messageData });
});

module.exports = {
    getChatDetails,
}