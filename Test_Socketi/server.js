var express = require('express')
var app = express()
var http = require('http').createServer(app)
var io = require("socket.io")(http)

app.get('/index.js', function (req, res) {
    res.sendFile(__dirname + '/index.js');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

})


io.on('connection', (socket) => {
    socket.broadcast.emit("hi")
    console.log("a user connected")

    socket.on("disconnect", () => {
        console.log("a user disconnected");
    });
    socket.on('chat message', function (msg) {
        console.log('on chat message')
        io.emit('chat message', msg);
    });
});

http.listen(3000, function () {
    console.log("linstening on *:3000")
})