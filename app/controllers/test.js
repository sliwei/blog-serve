const axios = require('axios');
const {CustomError, HttpError} = require('../routes/tool/error');

/**
 * GET TEST
 */
const get = async (ctx, next) => {
  let dat;
  try {
    dat = await axios.get('http://127.0.0.1:3000/core/test/get');
  } catch {
    throw new HttpError(500);
  }
  ctx.DATA.data = {
    query: ctx.query,
    dat: dat,
  };
  ctx.DATA.message = 'This is the GET test.';
  ctx.body = ctx.DATA;
};

/**
 * POST TEST
 */
const post = async (ctx, next) => {
  ctx.DATA.data = ctx.request.body;
  ctx.DATA.message = 'This is the POST test.';
  ctx.body = ctx.DATA;
};

module.exports = {
  get,
  post,
};
