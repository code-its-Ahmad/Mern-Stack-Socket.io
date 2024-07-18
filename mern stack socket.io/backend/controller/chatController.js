const asyncHandler = require('express-async-handler');
const Chat = require('../Model/chatMode');
const User = require('../Model/UserModel');

const accesschat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log('UserId param not sent with request');
        return res.sendStatus(400);
    }
    const isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { _id: req.user._id } } },
            { users: { $elemMatch: { _id: userId } } }
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage");

    const populatedChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (populatedChat.length > 0) {
        return res.status(200).json(populatedChat[0]);
    } else {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };
        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password");

            res.status(200).send(fullChat);
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }
});

const fetchchats = asyncHandler(async (req, res) => {
    try {
        const result = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage", "text sender readUsers")
            .sort({ updatedAt: -1 });

        const populatedChats = await User.populate(result, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        res.status(200).json(populatedChats);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

const creategroupchat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    let users = [];
    try {
        users = JSON.parse(req.body.users);
    } catch (error) {
        return res.status(400).send({ message: "Error parsing users" });
    }

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
        return res.status(400).send({ message: "chatId and chatName are required" });
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { chatName },
            { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if (!updatedChat) {
            return res.status(400).json({ message: "Chat not found" });
        } else {
            return res.status(200).json(updatedChat);
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

const addUserToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return res.status(400).send({ message: "chatId and userId are required" });
    }

    try {
        const added = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { users: userId } },
            { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if (!added) {
            res.status(404).json({ message: "Chat Not Found" });
        } else {
            res.status(200).json(added);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});
const removeUserFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return res.status(400).send({ message: "chatId and userId are required" });
    }
    try {
        const remove = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        if (!remove) {
            res.status(404).json({ message: "Chat Not Found" });
        } else {
            res.status(200).json(remove);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = 
{ 
accesschat, 
fetchchats, 
creategroupchat,
renameGroup,
addUserToGroup,
removeUserFromGroup };
