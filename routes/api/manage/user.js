const router = require('koa-router')();
const {createToken, checkToken} = require('../../tool/token');
const {checkCode} = require('../../tool/verification');
const db = require('../../database');
const {CustomError, HttpError} = require('../../tool/error');

router.prefix('/blog/manage/user');

/**
 * lw 修改资料
 * @param id 作者编号
 * @param name 昵称
 * @param rpassword 密码
 * @param mail 邮箱
 * @param website 站点
 * @param head_img 头像
 */
router.post('/edit_user', checkToken, async (ctx, next) => {
  let dat = ctx.request.body;
  let news = await db.op(`update bstu_user set 
  name = ${dat.name ? `'${dat.name}'` : 'name'},
  password = ${dat.rpassword ? `'${dat.rpassword}'` : 'password'},
  mail = ${dat.mail ? `'${dat.mail}'` : 'mail'},
  website = ${dat.website ? `'${dat.website}'` : 'website'},
  head_img = ${dat.head_img ? `'${dat.head_img}'` : 'head_img'}
  where id = ${dat.id}`);
  if (news.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

module.exports = router;
