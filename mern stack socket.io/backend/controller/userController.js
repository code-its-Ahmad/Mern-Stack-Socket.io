const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require('../Model/UserModel');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    console.log('Registering user:', { name, email, pic });

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        console.error('User already exists:', email);
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password, pic });

    if (user) {
        console.log('User created:', user);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    const user = await User.findOne({ email });
    if (!user) {
        console.error('User not found:', email);
        res.status(400);
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        console.error('Password does not match for user:', email);
        res.status(400);
        throw new Error('Invalid email or password');
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
    });
});

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password');
    res.send(users);
});

module.exports = { registerUser, loginUser, allUsers };
