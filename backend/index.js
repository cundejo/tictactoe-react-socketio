const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');
const { addUser, getUser, removeUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3001;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

// Types of messages that we can send with socket.io:
// io.emit                              Message to everyone connected to the server
// socket.emit                          Message only to the user of the socket
// socket.broadcast.emit                Message to everyone but the user of the socket
// io.to('channel').emit                Message to everyone in specific channel
// socket.broadcast.to('channel').emit  Message to everyone in specific channel but the user of the socket

io.on('connection', (socket) => {
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ username, room, id: socket.id });

    if (error) return callback(error);

    socket.join(user.room);
    socket.emit('message', generateMessage(`Welcome ${user.username}`));
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`));

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('message', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) return callback(generateMessage('Profanity is not allowed'));

    const user = getUser(socket.id);
    io.to(user.room).emit('message', generateMessage(message, user.username));
    callback();
  });

  socket.on('message-location', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message-location', generateMessage(message, user.username));
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} has left`));
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
