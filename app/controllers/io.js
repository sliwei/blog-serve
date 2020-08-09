const http = require('http')
const https = require('https');
const socketIo = require('socket.io')
const fs = require('fs');
const conf = require('../config');

const socket = app => {
  let server
  if (conf.socket_safe) {
    options = {
      key: fs.readFileSync(conf.ssh_options.key),
      cert: fs.readFileSync(conf.ssh_options.cert)
    };
    server = https.createServer(options, app.callback())
  } else {
    server = http.createServer(app.callback())
  }
  const io = socketIo(server);

  // 首页路由
  // io.of('/blog/chat').on('connection', (socket) => {
  io.on('connection', (socket) => {
    // console.log(socket);
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      socket.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  return server
}

module.exports = socket;