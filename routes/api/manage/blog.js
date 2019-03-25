const router = require('koa-router')();
const {createToken, checkToken} = require('../../tool/token');
const {checkCode} = require('../../tool/verification');
const db = require('../../database');
const {CustomError, HttpError} = require('../../tool/error');
const {randomString} = require('../../tool');

router.prefix('/blog/manage/blog');

/**
 * lw 博客列表
 * @param pageIndex 页码
 * @param pageSize 每页输
 */
router.get('/server_list', checkToken, async (ctx, next) => {
  let user = ctx.res.USER;
  let pageIndex = ctx.query.pageIndex;
  let pageSize = ctx.query.pageSize;
  let keyword = ctx.query.keyword;
  let category_id = ctx.query.category_id;
  pageIndex = parseInt(pageIndex);
  pageSize = parseInt(pageSize);
  category_id = category_id ? parseInt(category_id) : '';
  let red = (pageIndex * pageSize) - pageSize;
  let countSql = `select count(id) as total from bstu_blog where u_id = ${user.id} and is_del = 0`;
  let sql =
    `
    SELECT
      id,
      title,
      code,
      img,
      time,
      create_time,
      is_draft,
      is_evaluate,
      category_name,
      user_name
    FROM
      v_bstu_blog 
    WHERE
      u_id = ${user.id} 
      AND is_del = 0
    `;
  if (category_id) {
    countSql += ` AND category_id = ${category_id}`;
    sql += ` AND category_id = ${category_id}`;
  }
  if (keyword) {
    countSql += ` AND ( title LIKE '%${keyword}%' OR markdown LIKE '%${keyword}%' OR content LIKE '%${keyword}%' )`;
    sql += ` AND ( title LIKE '%${keyword}%' OR markdown LIKE '%${keyword}%' OR content LIKE '%${keyword}%' )`;
  }
  sql += ` ORDER BY id DESC LIMIT ${red},${pageSize}`;
  let count_sql = await db.op(countSql);
  let total = count_sql[0].total;
  let rows = await db.op(sql);
  ctx.DATA.data = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    pageCount: Math.ceil(total / pageSize),
    total: total,
    list: rows
  };
  ctx.body = ctx.DATA;
});

/**
 * lw 添加、修改博客
 * @param id 博客编号 不传则新增
 * @param tag_id 标签编号id
 * @param title 标题
 * @param content html内容
 * @param markdown markdown内容
 * @param is_draft 是否为草稿 1:草稿 0:默认非草稿
 * @param img 首图
 * @param time 自定义发布时间
 * @param is_evaluate 是否关闭评论 1:不允许 0:默认允许评论
 * @param code 不传，自动生成
 */
router.post('/edit', checkToken, async (ctx, next) => {
  let user = ctx.res.USER;
  let dat = ctx.request.body;
  dat = ctx.toEscapeObject(dat);
  let edit = false, canEdit = false;
  if (dat.id) {
    edit = true;
    let blog = await db.op(`select u_id from bstu_blog where id = ${dat.id}`);
    if (blog.length && blog[0].u_id === user.id) {
      canEdit = true;
    }
  }
  let res;
  if (edit) {
    if (canEdit) {
      res = await db.op(`update bstu_blog set 
      title = ${dat.title},
      content = ${dat.content},
      markdown = ${dat.markdown},
      is_draft = ${dat.is_draft >= 0 ? dat.is_draft : 'is_draft'},
      img = ${dat.img},
      time = ${dat.time || ''},
      is_evaluate = ${dat.is_evaluate >= 0 ? dat.is_evaluate : 'is_evaluate'}
      where id = ${dat.id}`);
    } else {
      ctx.DATA.code = 0;
      ctx.DATA.message = '你没有权限修改他人的博客哦~';
    }
  } else {
    let num = 0;
    let code = '';
    let check = async () => {
      num++;
      code = randomString(4);
      let have = await db.op(`select id from bstu_blog where code = '${code}'`);
      if (have.length > 0) {
        if (num > 20) {
          throw new HttpError(500);
        }
        await check();
      } else {
        return code;
      }
    };
    await check();
    res = await db.op(`
    insert into bstu_blog(u_id,title,content,markdown,time,is_draft,img,is_evaluate,code) 
    values(${user.id},${dat.title},${dat.content},${dat.markdown},${dat.time || ''},${dat.is_draft || 0},${dat.img},${dat.is_evaluate || 0},'${code}')`);
  }
  if (!res || res.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.json(ctx.DATA);
});

/**
 * lw 博客删除、恢复、草稿、发布
 * @param id 博客编号
 * @param sta 博客状态 1删除 0正常
 * @param draft 博客草稿状态 1草稿 0发布
 */
router.post('/blog_status', checkToken, async (ctx, next) => {
  let dat = ctx.request.body;
  let res = await db.op(`update bstu_blog set is_del = ${dat.sta >= 0 ? dat.sta : 'is_del'}, is_draft = ${dat.draft >= 0 ? dat.draft : 'is_draft'} where id = ${dat.id}`);
  if (res.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

/**
 * lw 博客详情
 * @param id 博客编号
 */
router.get('/detail', async (ctx, next) => {
  let id = ctx.query.id || 0;
  let code = ctx.query.code || '';
  let detail = await db.op(`select * from bstu_blog where code = '${code}' or id = ${id}`);
  ctx.DATA.data = detail[0];
  ctx.body = ctx.DATA;
});

module.exports = router;
