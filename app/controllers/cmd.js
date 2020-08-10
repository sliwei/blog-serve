const pty = require('node-pty');

const create = async (ctx, next) => {
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
  term.on('data', function(data) {
    logs[term.pid] += data;
  });
  ctx.body = term.pid.toString();
};

var terminals = {}, logs = {};
const connection = async (ctx, next) => {
  console.log('AAA');
  if (ctx.ws) {
    const ws = await ctx.ws();

    let term = terminals[parseInt(ctx.params.pid)];
    console.log('Connected to terminal ' + term.pid);
    ws.send(logs[term.pid]);

    let i = 1;

    // ws.send(`\x1b[1;30mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[0;30mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[1;30;40mwelcome\x1b[0m\r\n`)
    //
    // ws.send(`\x1b[1;31mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[0;31mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[1;31;41mwelcome\x1b[0m\r\n`)
    //
    // ws.send(`\x1b[1;32mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[0;32mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[1;32;42mwelcome\x1b[0m\r\n`)
    //
    // ws.send(`\x1b[1;33mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[0;33mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[1;33;43mwelcome\x1b[0m\r\n`)
    //
    // ws.send(`\x1b[1;34mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[0;34mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[1;34;44mwelcome\x1b[0m\r\n`)
    //
    // ws.send(`\x1b[1;35mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[0;35mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[1;35;45mwelcome\x1b[0m\r\n`)
    //
    // ws.send(`\x1b[1;36mwelcome Xterm!\x1b[0m\r\n`)
    // ws.send(`\x1b[0;36mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[1;36;46mwelcome\x1b[0m\r\n`)
    //
    // ws.send(`\x1b[1;37mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[0;37mwelcome\x1b[0m\r\n`)
    // ws.send(`\x1b[1;30;47mwelcome\x1b[0m\r\n`)

    // 1:30:47
    // 1:字体大小 0 细 1 粗
    // 30:字体颜色
    // 47:背景颜色
    // \x1b[m:结尾
    // https://bixense.com/clicolors/

    term.on('data', function(data) {
      try {
        ws.send(data);
      } catch (ex) {
        // The WebSocket is not open, ignore
      }
    });
    ws.on('message', function(msg) {
      term.write(msg);
    });
    ws.on('close', function () {
      term.kill();
      console.log('Closed terminal ' + term.pid);
      // Clean things up
      delete terminals[term.pid];
      delete logs[term.pid];
    });
  }
};

const cmd = async (ctx, next) => {
  // await ctx.render('cmd');
  await ctx.render('sk');
}

module.exports = {create, connection, cmd};
