/**
 * 数据校验
 * wiki：https://github.com/node-modules/parameter/blob/master/example.js
 * @type {Parameter}
 */
const { HttpError } = require('../../utils/tool/error')
const Parameter = require('parameter')
const parm = new Parameter()

// 自定义校验
parm.addRule('name', function (e, v) {
  let sta = /^[a-z]$/.test(v)
  return sta || '只能输入一个字母'
})

// 路由校验列表
const ruleList = {
  // 验证码
  _blog_manage_verification_code: {
    size: { type: 'string', required: false },
    w: { type: 'string', required: false },
    h: { type: 'string', required: false }
  },
  // 注册
  _blog_manage_login_register: {
    password: { type: 'string' },
    user: { type: 'string' }
  },
  // 登录
  _blog_manage_login_login: {
    code: { type: 'string' },
    key: { type: 'string' },
    password: { type: 'string' },
    user: { type: 'string' }
  }
}

/**
 * 校验方法
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const parameter = async (ctx, next) => {
  let errors, data
  if (ctx.request.method === 'GET') {
    data = ctx.query
  } else {
    data = ctx.request.body
  }
  try {
    let name = ctx.req._parsedUrl.pathname
    name = name.replace(/\//g, '_')
    errors = parm.validate(ruleList[name], data)
  } catch (e) {
    throw new HttpError(0, e.toString())
  }
  if (errors && errors.length) {
    ctx.DATA.data = errors
    throw new HttpError(0, '数据校验未通过')
  }
  await next()
}

module.exports = parameter
