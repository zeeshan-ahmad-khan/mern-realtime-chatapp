const express = require("express");
const app = express();
const cors = require('cors');
const env = require('dotenv').config();
const bodyParser = require('body-parser')
const connect = require('./src/db/connection');
const PORT = process.env.PORT || 5000;
const { createServer } = require('http')
const { Server } = require('socket.io');

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    console.log("A User Connected");
    socket.on("sent", (msg) => {
        io.emit("sentAgain", msg);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})
// routes
const authRouter = require('./src/routes/authRoutes');
const chatRouter = require('./src/routes/chatRoutes');
// middlewares
const errorMiddleware = require("./src/middlewares/errorMiddleware");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("<h1>Chatbook - MERN Realtime Chat App</h1>")
})
app.use('/chatbook/auth', authRouter);
app.use('/chatbook/chat', chatRouter);

app.use(errorMiddleware);

httpServer.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
    connect();
})