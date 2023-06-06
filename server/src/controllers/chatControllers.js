const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

const getChatDetails = asyncHandler(async (req, res) => {
    const { receiverId, senderId } = req.body;
    if (!receiverId || !senderId) {
        throw new Error('Receiver Id and/or Sender Id is missing');
    }

    const chatData = await Chat.find({ users: { $all: [receiverId, senderId] } });

    let newChatData = chatData[0];
    if (chatData.length === 0) {
        newChatData = await Chat.create({ users: [senderId, receiverId] })
    }

    res.json({ chatData: newChatData });
});

const getAllChatMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.body;
    if (!chatId) {
        throw new Error(`Chat Id is missing`);
    }

    const allMessages = await Message.find({ chatId });

    res.status(200).json({
        data: allMessages
    })
});

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, senderId, message } = req.body;

    if (!chatId || !senderId || !message) {
        throw new Error(`payload is required`);
    }

    const msg = await Message.create({
        chatId, senderId, message
    })

    res.status(200).json({
        message: "Message send successfully"
    })
})

module.exports = {
    getChatDetails,
    getAllChatMessages,
    sendMessage
}