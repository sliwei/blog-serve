const request = require('request')
const re = async (ctx, next) => {
  await ctx.render('re')
}
/**
 * 谷歌校验
 */
const recaptcha = async (ctx, next) => {
  console.log(ctx.query.token)
  const url = 'https://www.recaptcha.net/recaptcha/api/siteverify'
  const secret_key = '6LdOO74ZAAAAAFn3LrtVVW6tR8-PpWcq7i1s7RDX'
  const token = ctx.query.token
  const response = await request(
    `${url}?secret=${secret_key}&response=${token}`,
    {
      method: 'post'
    }
  )
  ctx.DATA.data = response
  ctx.DATA.message = 'This is the GET test.'
  ctx.body = ctx.DATA
}

module.exports = {
  re,
  recaptcha
}
