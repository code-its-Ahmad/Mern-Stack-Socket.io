const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectdb = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRouter');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/ErrorMiddleware');
dotenv.config();
connectdb();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.yellow.bold);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
});

io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
        console.log(`User connected: ${userData._id}`);
    });

    socket.on('joinChat', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('newMessage', (newMessageRecived) => {
        const chat = newMessageRecived.chat;

        if (!chat.users) return console.log('Chat.users not defined');

        chat.users.forEach((user) => {
            if (user._id == newMessageRecived.sender._id) return;

            socket.in(user._id).emit('messageReceived', newMessageRecived);
        });
    });

    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    });

    socket.on('stopTyping', (room) => {
        socket.in(room).emit('stopTyping');
    });
    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData._id);
    })
});
