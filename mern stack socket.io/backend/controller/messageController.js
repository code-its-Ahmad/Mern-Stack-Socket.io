const asyncHandler = require('express-async-handler');
const Message = require('../Model/messageModel');
const User = require('../Model/UserModel');
const Chat = require('../Model/chatMode');

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        return res.status(400).json({ message: "Please add a message and chatId" });
    }
    const newMessage = {
        content: content,
        chat: chatId,
        sender: req.user._id
    };
    try {
        let message = await Message.create(newMessage);
        message = await message.populate('sender', 'name pic')
        message = await message.populate('chat')
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        });
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        return res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name pic')
            .populate('chat');
        
        return res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = { sendMessage, allMessages };
