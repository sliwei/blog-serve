const svgCaptcha = require('svg-captcha')
const md5 = require('js-md5')
const Geetest = require('gt3-sdk')
const conf = require('../../config')

/**
 * 生成数字字母验证码
 */
const code = async function (ctx, next) {
  let fontSize = ctx.query.size || 40
  let width = ctx.query.w || 150
  let height = ctx.query.h || 50
  svgCaptcha.options.fontSize = fontSize // captcha的宽度
  svgCaptcha.options.width = width // 验证码的高度
  svgCaptcha.options.height = height // captcha文本大小
  // svgCaptcha.options.charPreset = charPreset; // 随机字符预设
  let captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1iLlI',
    noise: 2,
    color: false
    // background: '#fff'
  })
  let key = md5(`${conf.verificationObs}${captcha.text.toLowerCase()}`)
  ctx.DATA.data = {
    svg: captcha.data,
    key: key
  }
  ctx.body = ctx.DATA
}

/**
 * 极验
 */
const gtCode = async function (ctx, next) {
  var captcha = new Geetest(conf.gt)
  const code = await new Promise((resolve, reject) => {
    captcha.register(null, function (err, data) {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
  ctx.DATA.data = code
  ctx.body = ctx.DATA
}

module.exports = {
  code,
  gtCode
}
