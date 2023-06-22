const io = require("socket.io")(8080, {
    cors: {
        origin: "*"
    }
})

let activeUsers = [];

io.on("connection", (socket) => {
    socket.on("new-user-added", (userId) => {
        const isUserAlreadyConnected = activeUsers.some((user) => user.userId === userId);
        if (!isUserAlreadyConnected) {
            activeUsers.push({
                userId,
                socketId: socket.id
            })
        }
        io.emit("get-online-users", activeUsers)
    })

    socket.on("sendMessage", (data) => {
        socket.broadcast.emit("receiveMessage", data);
    })

    socket.on("user-typing", (data) => {
        io.emit("typing", { username: data.username })
    })

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit("get-online-users", activeUsers)
    })
})  