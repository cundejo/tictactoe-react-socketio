const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3001;

// Types of messages that we can send with socket.io:
// io.emit                              Message to everyone connected to the server
// socket.emit                          Message only to the user of the socket
// socket.broadcast.emit                Message to everyone but the user of the socket
// io.to('channel').emit                Message to everyone in specific channel
// socket.broadcast.to('channel').emit  Message to everyone in specific channel but the user of the socket

io.on('connection', (socket) => {

  socket.on('join', () => {
    socket.emit('message', 'Hello from server');
    io.emit('message', 'User connected')
  });

  socket.on('disconnect', () => {
    io.emit('message', 'User disconnected')
  });
});

server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
