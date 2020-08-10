const http = require('http')
const https = require('https');
const socketIo = require('socket.io')
const fs = require('fs');
const conf = require('../config');
const pty = require('node-pty');

var terminals = {}, logs = {};
const socket = app => {
  let server
  if (conf.socket_safe) {
    options = {
      key: fs.readFileSync(conf.ssh_options.key),
      ca: fs.readFileSync(conf.ssh_options.ca),
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

    const pid = socket.handshake.query
    const ioId = socket.id

    let term = terminals[ioId]

    if (!term) {
      term = create(ioId)
    }

    socket.emit('chat message', '\x1b[0;36mwelcome \x1b[1;31mXterm\x1b[1;36m!\x1b[0m\r\n')
    socket.emit('chat message', 'ioId: \x1b[1;32m' + ioId + '\x1b[m\r\n')
    socket.emit('chat message', '实时日志: \x1b[0;36mpm2 logs 1v1-crm-graphql\x1b[m\r\n')
    socket.emit('chat message', '历史日志: \x1b[0;36mtail -n [number] /root/.pm2/logs/1v1-crm-graphql-[number].log\x1b[m\r\n')

    // 1:30:47
    // 1:字体大小 0 细 1 粗
    // 30:字体颜色
    // 47:背景颜色
    // \x1b[m:结尾
    // https://bixense.com/clicolors/

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      term.write(msg);
    });
    term.on('data', function (data) {
      try {
        console.log(data);
        if (data.includes('bash-3.2$')) {
          socket.emit('chat message', '\x1b[1;36m' + data + '\x1b[m')
        } else {
          socket.emit('chat message', data)
        }
      } catch (ex) {
        // The WebSocket is not open, ignore
      }
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
      term.kill();
      console.log('Closed terminal ' + ioId);
      // Clean things up
      delete terminals[ioId];
      // delete logs[ioId];
    });
  });
  return server
}

const io = async (ctx, next) => {
  await ctx.render('cmd');
}

const create = (ioId) => {
  // let cols = parseInt(ctx.query.cols)
  // let rows = parseInt(ctx.query.rows)
  let term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.PWD,
    env: process.env
  });
  console.log('Created terminal with PID: ' + term.pid);
  terminals[ioId] = term;
  // logs[term.pid] = '';
  // term.on('data', function (data) {
  //   logs[term.pid] += data;
  // });
  // return term.pid.toString()
  return term
}

const ioCreate = async (ctx, next) => {
  let cols = parseInt(ctx.query.cols),
    rows = parseInt(ctx.query.rows),
    term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
      name: 'xterm-color',
      cols: cols || 80,
      rows: rows || 24,
      cwd: process.env.PWD,
      env: process.env
    });

  console.log('Created terminal with PID: ' + term.pid);
  terminals[term.pid] = term;
  logs[term.pid] = '';
  term.on('data', function (data) {
    logs[term.pid] += data;
  });
  ctx.body = term.pid.toString();
};

module.exports = {socket, io, ioCreate};