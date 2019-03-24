const router = require('koa-router')();
const {createToken, checkToken} = require('../tool/token');
const {checkCode} = require('../tool/verification');
const db = require('../database');

router.prefix('/blog/manage/friend');

/**
 * lw 友链列表
 */
router.get('/friend_list', async (ctx, next) => {
  let friend = await db.op('select * from bstu_friend where is_del = 0 order by id desc');
  ctx.DATA.data = friend;
  ctx.body = ctx.DATA;
});

/**
 * lw 添加、修改、删除友链
 * @param id 编号
 * @param title 站点名称
 * @param website 友链地址
 * @param sta 删除1:删除 0:正常
 */
router.post('/operation_friend', checkToken, async (ctx, next) => {
  let dat = ctx.request.body;
  let friend;
  if (!dat.id) {
    // 新增
    friend = await db.op(`insert into bstu_friend(title, website) values('${dat.title}', '${dat.website}')`);
  } else {
    // 修改、删除
    friend = await db.op(`update bstu_friend set 
    title = '${dat.title || 'title'}',
    website = '${dat.website || 'website'}',
    is_del = ${dat.sta || 'is_del'}
    where id = ${dat.id}`);
  }
  if (!friend || friend.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

module.exports = router;
