require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let userOnlineCount = 0;

io.on('connection', (socket) => {
  ++userOnlineCount;
  io.emit('online notif');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('online count', () => {
    io.emit('online count', userOnlineCount);
  });

  socket.on('disconnect', () => {
    --userOnlineCount;
    io.emit('online', userOnlineCount);
    io.emit('offline notif');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});