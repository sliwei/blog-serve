/**
 * lw 配置文件
 */
const db = require('./mysql');

module.exports = {
  port: 3004, // 端口
  db: db, // 数据库
  tokenObs: 'blog-serve', // token混淆码
  verificationObs: 'blog-serve', // 验证码混淆码
  verificationSta: true, // 启用验证码
  cookieOptions: {
    maxAge: 1000 * 3600 * 48,
    path: '/',
    httpOnly: false
  },
  socket_safe: true,
  ssh_options: {      // https证书
    // key: '/Users/admin/app/privkey.pem',
    // ca: '/Users/admin/app/chain.pem',
    // cert: '/Users/admin/app/fullchain.pem'

    key: '/etc/letsencrypt/live/api.bstu.cn/privkey.pem',
    ca: '/etc/letsencrypt/live/api.bstu.cn/chain.pem',
    cert: '/etc/letsencrypt/live/api.bstu.cn/fullchain.pem'
  },
};
