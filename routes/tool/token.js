const {HttpError} = require('./error');
const axios = require('axios');

/**
 * 创建token
 * @param dat
 * @returns {*}
 */
const createToken = async function (dat) {
  return await axios.post('http://localhost:3000/core/token/create', dat);
};

/**
 * 检测token合法性
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const checkToken = async (ctx, next) => {
  // Authorization TODO:如果需要允许所有跨域，那么只有不使用cookie，改为Authorization存token
  const token = ctx.get('Authorization');
  // const token = ctx.cookie.get('token');
  if (!token) {
    throw new HttpError(401);
  }
  try {
    let res = await axios.post('http://localhost:3000/core/token/check', {token: token});
    if (res.data.code !== 200) {
      throw new HttpError(401);
    }
    ctx.res.USER = res.data.data;
  } catch (err) {
    throw new HttpError(401);
  }
  await next();
};

module.exports = {
  createToken,
  checkToken
};