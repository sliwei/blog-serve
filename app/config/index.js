/**
 * 配置文件
 */
const env = require(`../../config/.env.${process.env.ENV}.js`)

const config = {
  mode: process.env.MODE, // development || production
  port: 3000, // 端口
  tokenObs: 'blog-serve', // token混淆码
  verificationObs: 'blog-serve', // 验证码混淆码
  verificationSta: true, // 启用验证码
  cookieOptions: {
    maxAge: 5 * 60 * 60 * 1000, // 毫秒
    path: '/',
    httpOnly: false
  }
}
// 合并环境配置到config
Object.assign(config, env)

console.log('模式:', process.env.MODE)
console.log('环境:', process.env.ENV)
console.log('Listening on port: http://localhost:%d', config.port)

module.exports = config
