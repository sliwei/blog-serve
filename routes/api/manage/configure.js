const router = require('koa-router')();
const {createToken, checkToken} = require('../../tool/token');
const {checkCode} = require('../../tool/verification');
const db = require('../../database');

router.prefix('/blog/manage/configure');

/**
 * lw 获取配置
 */
router.get('/get_configure', async (ctx, next) => {
  let configure = await db.op('select * from bstu_configure');
  ctx.DATA.data = configure;
  ctx.body = ctx.DATA;
});

/**
 * lw 修改配置
 * @param c_key 配置项 author：作者
 * @param val 配置项值
 */
router.post('/set_configure', checkToken, async (ctx, next) => {
  let dat = ctx.request.body;
  let configure = await db.op(`update bstu_configure set val = '${dat.val}' where c_key = '${dat.c_key}'`);
  console.log(configure);
  if (!configure || configure.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

module.exports = router;
