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
  ssh_options: {      // https证书
    key: '/etc/letsencrypt/live/api.bstu.cn/privkey.pem',
    cert: '/etc/letsencrypt/live/api.bstu.cn/fullchain.pem'
  },
};
