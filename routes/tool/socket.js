/**
 * Created by awei on 2017/3/26.
 * socketIo
 */
const https = require('https');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const conf = require('../../config');
const db = require('../database');

var IO = {};

// 特殊字符转义
function ClearBr(key) {
  key = key.replace(/<\/?.+?>/g, "");
  key = key.replace(/[\r\n]/g, "");
  key = key.replace(/\s+/g, "");
  key = key.replace(/\'/g, "\'");
  key = key.replace(/\"/g, "\\\"");
  return key;
}

function sql() {
  return db.op('select * from bstu_user');
}

function set() {
  return IO
}


function srever(app) {
  // https conf
  let options = {}, server;
  if (conf.socket_safe) {
    options = {
      key: fs.readFileSync(conf.ssh_options.key),
      ca: fs.readFileSync(conf.ssh_options.ca),
      cert: fs.readFileSync(conf.ssh_options.cert)
    };
    server = https.Server(options, app.callback()).listen(conf.socket_port);
  } else {
    server = http.Server(app.callback()).listen(conf.socket_port);
  }
  let io = socketIo(server);
  IO = io;
  let number = 0, ids = [], roomInfo = [];
  let userList = [];
  io.on('connection', async function (socket) {

    // console.log(socket.id);

    // 返回在线列表
    const sendList = () => {
      // console.log(userList);
      let retList = [];
      userList.map(item => {
        retList.push({
          id: item.id,
          user: item.user,
          name: item.name,
          head_img: item.head_img,
        })
      });
      console.log(retList);
      let listTxt = JSON.stringify(retList);
      io.sockets.emit('all', 1, listTxt);
    };

    // 上线后进入原有房间
    const joinRoom = user => {
      let joinList = [];
      for (let key in roomInfo) {
        key.indexOf(user) >= 0 && (joinList.push(key));
      }
      // 进入所有房间
      joinList.map(item => {
        socket.join(item);
        user && roomInfo[item].push(user);
      });
    };

    socket.on('disconnect', function (d) {
      // console.log(socket.id);
      // console.log(d);
    });

    // let roomID = '', user = '';

    // 进入大厅、过滤
    socket.on('hall', async (user, name) => {
      // console.log(user, name);

      if (!user || !name) {
        return false;
      }

      // 查询头像昂
      let dat = await db.op(`select head_img, id from bstu_user where user = '${user}'`);

      // 在线检测
      let sta = false;
      userList.map(item => {
        if (item.user === user) {
          sta = true;

          item.id = socket.id;
          item.socket = socket;

        }
      });

      // 加入在线列表
      if (!sta) {
        userList.push({
          id: socket.id,
          user: user,
          name: name,
          socket: socket,
          head_img: dat[0].head_img,
          u_id: dat[0].id,
        });
        // io.sockets.emit('all', 0, `${name}进入了大厅,块找他聊天吧!`);
        // 推送全局在线列表

        joinRoom(user);
      } else {
        // socket.emit('tips', 0, '你已在其他地方登陆,已为你切换')
      }

      sendList();
    });

    // 挤线
    socket.on('squeeze', (user, name) => {
      // socket.leave(roomID); 离开房间
      // socket.join(roomID); 进入房间
    });

    // 进入房间、发送房间信息 1-1 1-n
    socket.on('room', (roomID, user, msg) => {
      // 验证如果用户不在房间内则不给发送
      let other = [user], have = false;
      if (roomID.indexOf('+') >= 0) {
        other = roomID.split('+');
        if (roomInfo[`${other[0]}+${other[1]}`]) {
          have = true;
          roomID = `${other[0]}+${other[1]}`;
        }
        if (roomInfo[`${other[1]}+${other[0]}`]) {
          have = true;
          roomID = `${other[1]}+${other[0]}`;
        }
      }
      if (!have) {
        if (!roomInfo[roomID]) {
          roomInfo[roomID] = [];
          // 创建房间
        }
        if (other[0] && roomInfo[roomID].indexOf(user) === -1) {
          roomInfo[roomID].push(user);
          socket.join(roomID);
        }
        if (other[1] && roomInfo[roomID].indexOf(other[1]) === -1) {
          userList.map(item => {
            if (item.user === other[1]) {
              roomInfo[roomID].push(other[1]);
              item.socket.join(roomID);
            }
          });
        }
        if (!user || roomInfo[roomID].indexOf(user) === -1) {
          return false;
        }
      } else {
        roomInfo[roomID].indexOf(user) === -1 && (roomInfo[roomID].push(user), socket.join(roomID));
      }
      console.log(roomInfo);
      console.log(roomID, user, msg);
      io.to(roomID).emit('roomMessage', user, msg);

      // sql ----

      // 插入一条聊天记录
      const insert = (r_id) => {
        let u_id = userList.filter(item => item.user === user)[0].u_id;
        db.op(`insert into bstu_room_message(r_id, type, cont, u_id) values(${r_id}, 0, '${msg}', ${u_id})`)
      };

      // 查询房间信息和(没房间就创建一个房间)
      db.op(`select id from bstu_room where name = '${roomID}'`).then(res => {
        console.log(res);
        if (!res.length) {
          db.op(`insert into bstu_room(name) values('${roomID}')`).then(newRes => {
            insert(newRes.insertId);
          })
        } else {
          insert(res[0].id);
        }
      });

      // sql ----
    });

    // 加入房间
    socket.on('join', (roomID, user, name) => {
      if (!roomInfo[roomID]) {
        roomInfo[roomID] = [];
      }
      roomInfo[roomID].push(user);
      socket.join(roomID);
      io.to(roomID).emit('sys', name + '加入了房间', roomInfo[roomID]);
    });

    // 离线掉线下线
    socket.on('disconnect', res => {
      let name = '', user = '', leaveList = [];
      userList = userList.filter(item => {
        if (item.id === socket.id) {
          // 名字作为下线提示
          name = item.name;
          // 获取账号，做为退出房间用
          user = item.user;
        }
        return item.id !== socket.id;
      });
      name && io.sockets.emit('all', 0, `${name}下线了!`);
      name && sendList();

      for (let key in roomInfo) {
        key.indexOf(user) >= 0 && (leaveList.push(key));
      }

      console.log('leaveList', leaveList);

      // 离开所有房间
      leaveList.map(item => {
        socket.leave(item);
        user && roomInfo[item].splice(roomInfo[item].indexOf(user), 1);
      });
      console.log('roomInfo', roomInfo);
    });

    //
    // console.log(socket.request.headers);
    //
    // let roomID = '', user = '';
    // socket.on('join', function (dat) {
    //
    //   console.log(dat, dat.roomName);
    //   roomID = dat.roomName;
    //   user = dat.userName;
    //   // user = userName;
    //   //
    //   // 将用户昵称加入房间名单中
    //   if (!roomInfo[dat.roomName]) {
    //     roomInfo[dat.roomName] = [];
    //   }
    //   roomInfo[dat.roomName].push(dat.userName);
    //   //
    //   socket.join(dat.roomName);    // 加入房间
    //   // // 通知房间内人员
    //   io.to(dat.roomName).emit('sys', dat.userName + '加入了房间', roomInfo[dat.roomName]);
    //   console.log(dat.userName + '加入了' + dat.roomName);
    // });
    //
    // // 接收用户消息,发送相应的房间
    // socket.on('message', function (res) {
    //   // 验证如果用户不在房间内则不给发送
    //   if (!user || roomInfo[roomID].indexOf(user) === -1) {
    //     return false;
    //   }
    //
    //   res = ClearBr(res);
    //   let t = new Date();
    //   let h = t.getHours() >= 10 ? t.getHours() : `0${t.getHours()}`;
    //   let m = t.getMinutes() >= 10 ? t.getMinutes() : `0${t.getMinutes()}`;
    //   let s = t.getSeconds() >= 10 ? t.getSeconds() : `0${t.getSeconds()}`;
    //   console.log(`信息: ${h}:${m}:${s} ${res}`);
    //   // 向所有连接发送信息
    //   let message = `{"name": "${user}", "text": "${res}", "time": "${t.toISOString().slice(0, 10)} ${t.toISOString().slice(11, 19)}"}`;
    //   io.to(roomID).emit('message', message);
    // });
    //
    //
    // // 连接人数
    // let socket_id = socket.id || undefined;
    // ids.push(socket_id);
    // number++;
    // let u = await sql()
    // io.sockets.emit('number', u);
    //
    // socket.emit('id', socket_id);
    // console.log('上线通知：[' + socket_id + '], 当前在线人' + number);
    // // 读取历史
    // // fs.readFile('./message.txt', 'utf-8', function(err, data) {
    // //   if (err) {
    // //     throw err;
    // //   }
    // //   socket.emit('message_dat', data);
    // // });
    // //丢失连接
    // socket.on('disconnect', function (d) {
    //   // 减少人数
    //   number--;
    //   io.sockets.emit('number', number);
    //   console.log('离线通知：[' + socket_id + '], 当前在线人' + number);
    //   ids.map(function (item, index) {
    //     if (item == socket_id)
    //       ids.splice(index, 1);
    //   });
    // });
    // 接收信息
    // socket.on('message', res => {
    //   res = ClearBr(res);
    //   let t = new Date();
    //   let h = t.getHours() >= 10 ? t.getHours() : `0${t.getHours()}`;
    //   let m = t.getMinutes() >= 10 ? t.getMinutes() : `0${t.getMinutes()}`;
    //   let s = t.getSeconds() >= 10 ? t.getSeconds() : `0${t.getSeconds()}`;
    //   console.log(`信息: ${h}:${m}:${s} ${res}`);
    //   // 保存记录
    //   let message = `{"code": "${socket_id}", "text": "${res}", "time": "${t.toISOString().slice(0, 10)} ${t.toISOString().slice(11, 19)}"}`;
    //   fs.writeFile('./message.txt', `${message},`, {'flag': 'a'}, function (err) {
    //     if (err) {
    //       throw err;
    //     }
    //   });
    //   // 向所有连接发送信息
    //   io.sockets.emit('message', message);
    // });
    // ...
  });
}

module.exports = {
  srever: srever,
  set: set
};
