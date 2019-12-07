const conf = require('../../config');
const Geetest = require('gt3-sdk');
const md5 = require('js-md5');
const {CustomError, HttpError} = require('./error');
const gt = require('../../config/gt');

/**
 * 检测验证码正确性
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const checkCode = async (ctx, next) => {
  if (conf.verificationSta) {
    let code = ctx.request.body.code || '';
    let key = ctx.request.body.key;
    if (ctx.request.method === 'GET') {
      code = ctx.params.code || '';
    }
    // let key = ctx.cookie.get('code2');
    let codeSta = false;
    if (code) {
      let getCode = `${conf.verificationObs}${code.toLowerCase()}`;
      let md5Code = md5(getCode);
      if (code && md5Code === key) {
        codeSta = true;
      }
    }
    if (!codeSta) {
      throw new HttpError(1)
    }
  }
  // !('check' in ctx.res) ? ctx.res.check = {} : null;
  // ctx.res.check.code = codeSta;
  await next();
};

/**
 * Gt校验
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const checkGtCode = async (ctx, next) => {
  var captcha = new Geetest(gt);
  console.log(ctx.request.body);
  const gtSta = await new Promise((resolve, reject) => {
    captcha.validate(false, {
      geetest_challenge: ctx.request.body.geetest_challenge,
      geetest_validate: ctx.request.body.geetest_validate,
      geetest_seccode: ctx.request.body.geetest_seccode
    }, function (err, success) {
      console.log(success);
      if (err) {
        // 网络错误
        reject(err)
      } else if (!success) {
        // 二次验证失败
        resolve(false)
      } else {
        resolve(true)
      }
    });
  });
  console.log(gtSta);
  if (!gtSta) {
    throw new HttpError(1)
  }

  await next();
};

module.exports = {checkCode, checkGtCode};
