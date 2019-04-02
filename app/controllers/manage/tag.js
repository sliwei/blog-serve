const router = require('koa-router')();
const {createToken, checkToken} = require('../../tool/token');
const {checkCode} = require('../../tool/verification');
const db = require('../../sequelize');
const {CustomError, HttpError} = require('../../tool/error');

router.prefix('/blog/manage/tag');

/**
 * lw 标签列表
 */
router.get('/tag_list', async (ctx, next) => {
  let tag = await db.op('select * from bstu_tag where is_del = 0 order by id desc');
  console.log(tag);
  ctx.DATA.data = tag;
  ctx.body = ctx.DATA;
});

/**
 * lw 添加、修改、删除标签
 * @param id 编号
 * @param name 名称
 * @param sta 删除1:删除 0:正常
 */
router.post('/operation_tag', checkToken, async (ctx, next) => {
  let dat = ctx.request.body;
  let tag;
  if (!dat.id) {
    // 新增
    tag = await db.op(`insert into bstu_tag(name) values('${dat.name}')`);
  } else {
    let have = false;
    if (dat.sta && dat.sta === 1) {
      let isDel = await db.op(`select count(id) as num from bstu_blog_tag where t_id = ${dat.id}`);
      if (isDel[0].num > 0) {
        have = true;
      }
    }
    if (have) {
      ctx.DATA.code = 0;
      ctx.DATA.message = '不能删除已被使用的标签';
    } else {
      // 修改、删除
      tag = await db.op(`update bstu_tag set 
      name = '${dat.name || 'name'}',
      is_del = ${dat.sta || 'is_del'}
      where id = ${dat.id}`);
    }
  }
  if (!tag || tag.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

module.exports = router;
