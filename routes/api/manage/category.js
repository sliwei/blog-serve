const router = require('koa-router')();
const {createToken, checkToken} = require('../../tool/token');
const {checkCode} = require('../../tool/verification');
const db = require('../../database');
const {CustomError, HttpError} = require('../../tool/error');

router.prefix('/blog/manage/category');

/**
 * lw 分类列表
 */
router.get('/category_list', async (ctx, next) => {
  let category = await db.op('select * from bstu_category where is_del = 0 order by id desc');
  ctx.DATA.data = category;
  ctx.body = ctx.DATA;
});

/**
 * lw 添加、修改、删除分类
 * @param id 编号
 * @param name 名称
 * @param sta 删除1:删除 0:正常
 */
router.post('/operation_category', checkToken, async (ctx, next) => {
  let dat = ctx.request.body;
  let category;
  if (!dat.id) {
    // 新增
    category = await db.op(`insert into bstu_category(name) values('${dat.name}')`);
  } else {
    let have = false;
    if (dat.sta && dat.sta === 1) {
      let isDel = await db.op(`select count(id) as num from bstu_blog where category_id = ${dat.id}`);
      if (isDel[0].num > 0) {
        have = true;
      }
    }
    if (have) {
      ctx.DATA.code = 0;
      ctx.DATA.message = '不能删除已被使用的分类';
    } else {
      // 修改、删除
      category = await db.op(`update bstu_category set 
      name = '${dat.name || 'name'}',
      is_del = ${dat.sta || 'is_del'}
      where id = ${dat.id}`);
    }
  }
  if (!category || category.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

module.exports = router;
