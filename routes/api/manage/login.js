const router = require('koa-router')();
const {createToken, checkToken} = require('../tool/token');
const {checkCode} = require('../tool/verification');
const db = require('../database');
const {CustomError, HttpError} = require('../tool/error');

router.prefix('/blog/manage/login');

/**
 * lw 验证信息
 * @param Authorization token
 */
router.get('/info', checkToken, async (ctx, next) => {
  let user = ctx.res.USER;
  let userDat = await db.op(`select * from bstu_user where id = ${user.id}`);
  if (userDat.length) {
    ctx.DATA.data = {
      name: userDat[0].name,
      mail: userDat[0].mail,
      user: userDat[0].user,
      website: userDat[0].website,
      good: userDat[0].good,
      bad: userDat[0].bad,
      newly_login: userDat[0].newly_login,
      head_img: userDat[0].head_img,
    };
  } else {
    throw new HttpError(401);
  }
  ctx.body = ctx.DATA;
});

/**
 * lw 登录
 * @param user 账号
 * @param password 密码
 * @param code 验证码
 */
router.post('/login', checkCode, async (ctx, next) => {
  let dat = ctx.request.body;
  let data = await db.op(`select id,name,user,head_img from bstu_user where user = "${dat.user}" and password = "${dat.password}" limit 1`);
  if (data.length) {
    db.op(`update bstu_user set newly_login = now() where id = ${data[0].id}`);
    ctx.DATA.data = {
      token: createToken({id: data[0].id}),
      user: data[0].user,
      name: data[0].name,
      head_img: data[0].head_img,
      id: data[0].id,
    }
  } else {
    ctx.DATA.code = 0;
    ctx.DATA.message = '账户名或密码错误'
  }
  ctx.body = ctx.DATA;
});

/**
 * lw 注册
 * @param name 昵称
 * @param user 账号
 * @param rpassword 密码
 * @param code 验证码
 */
router.post('/register', checkCode, async (ctx, next) => {
  let dat = ctx.request.body;
  let news = await db.op(`insert into bstu_user(name, user, password) values('${dat.name}', "${dat.user}", "${dat.rpassword}")`);
  if (news.affectedRows < 1) {
    ctx.DATA.code = 0;
    ctx.DATA.message = '注册失败';
  }
  ctx.body = ctx.DATA;
});

module.exports = router;
