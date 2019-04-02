/**
 * wiki：https://github.com/node-modules/parameter/blob/master/example.js
 * @type {Parameter}
 */
const {HttpError} = require('../routes/tool/error');
const Parameter = require('parameter');
const parm = new Parameter();

// 自定义校验
parm.addRule('name', function (e, v) {
  let sta = /^[a-z]$/.test(v);
  return sta || '只能输入一个字母';
});

// 路由校验
const ruleList = {
  _blog_manage_admin_p: {
    name: 'name',
  },
  _blog_manage_admin_sys: this._blog_manage_admin_p,
};

/**
 * 校验方法
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const parameter = async (ctx, next) => {
  let errors, data;
  if (ctx.request.method === 'GET') {
    data = ctx.query;
  } else {
    data = ctx.request.body;
  }
  console.log(typeof data.age);
  try {
    let name = ctx.req._parsedUrl.pathname;
    name = name.replace(/\//g, '_');
    errors = parm.validate(ruleList[name], data);
  } catch (e) {
    throw new HttpError(0, e)
  }
  if (errors && errors.length) {
    ctx.DATA.data = errors;
    throw new HttpError(0, '数据校验未通过')
  }
  await next();
};

module.exports = parameter;
