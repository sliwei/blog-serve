const fetch = require('node-fetch')
const re = async (ctx, next) => {
  await ctx.render('re')
}
/**
 * 谷歌校验
 */
const validate = async (ctx, next) => {
  const token = ctx.query.token
  const secretKey = '6LfTlxkfAAAAAPa-1zRYDzDkOImff4hBYWuAg-Bu'
  const verifyURL = `https://www.recaptcha.net/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
  const body = await fetch(verifyURL).then((res) => res.json())
  ctx.DATA.data = body
  ctx.body = ctx.DATA
}

module.exports = {
  re,
  validate
}
