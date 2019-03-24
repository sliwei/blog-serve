const router = require('koa-router')();
const {createToken, checkToken} = require('../tool/token');
const {checkCode} = require('../tool/verification');
const db = require('../database');
const {CustomError, HttpError} = require('../tool/error');
const {randomString} = require('../tool');

router.prefix('/blog/client/blog');

/**
 * lw 博客列表
 * @param pageIndex 页码
 * @param pageSize 每页数
 */
router.get('/list', async (ctx, next) => {
  let pageIndex = ctx.query.pageIndex;
  let pageSize = ctx.query.pageSize;
  pageIndex = parseInt(pageIndex);
  pageSize = parseInt(pageSize);
  let count_sql = await db.op(`select count(id) as total from v_bstu_blog where is_draft = 0 and is_del = 0`);
  let total = count_sql[0].total;
  let red = (pageIndex * pageSize) - pageSize;
  let rows = await db.op(
    `
    SELECT
      id,
      code,
      title,
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
      is_draft = 0 
      AND is_del = 0 
    ORDER BY
      id DESC 
      LIMIT ${red},${pageSize}
    `
  );
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
 * lw 博客搜索
 * @param pageIndex 页码
 * @param pageSize 每页数
 * @param keyword 关键字
 */
router.get('/search', async (ctx, next) => {
  let pageIndex = ctx.query.pageIndex;
  let pageSize = ctx.query.pageSize;
  let keyword = ctx.query.keyword;
  keyword = keyword ? decodeURIComponent(keyword) : '';
  pageIndex = parseInt(pageIndex);
  pageSize = parseInt(pageSize);
  let count_sql = await db.op(
    `
    SELECT
      count( id ) AS total 
    FROM
      v_bstu_blog 
    WHERE
      is_draft = 0 
      AND is_del = 0 
      AND ( title LIKE '%${keyword}%' OR markdown LIKE '%${keyword}%' OR content LIKE '%${keyword}%' )
    `
  );
  let total = count_sql[0].total;
  let red = (pageIndex * pageSize) - pageSize;
  let rows = await db.op(
    `
    SELECT
      id,
      code,
      title,
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
      is_draft = 0 
      AND is_del = 0 
      AND ( title LIKE '%${keyword}%' OR markdown LIKE '%${keyword}%' OR content LIKE '%${keyword}%' ) 
    ORDER BY
      id DESC 
      LIMIT ${red},${pageSize}
    `
  );
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
 * lw 当前博客的邻居(上一个和下一个的文章、前端)
 * @param id 博客编号
 */
router.get('/neighbor', async (ctx, next) => {
  let id = ctx.query.id;
  let after = await db.op(
    `
    SELECT
      b.code,
      b.title,
      u.NAME AS user_name 
    FROM
      ( SELECT u_id, code, title FROM bstu_blog WHERE is_draft = 0 and is_del = 0 and id < ${id} ORDER BY id DESC LIMIT 0, 1 ) b
      LEFT JOIN bstu_user u ON b.u_id = u.id
    `
  );

  let front = await db.op(
    `
    SELECT
      b.code,
      b.title,
      u.NAME AS user_name 
    FROM
      ( SELECT u_id, code, title FROM bstu_blog WHERE is_draft = 0 and is_del = 0 and id > ${id} ORDER BY id LIMIT 0, 1 ) b
      LEFT JOIN bstu_user u ON b.u_id = u.id
    `
  );
  ctx.DATA.data = {
    front: front[0] || {},
    after: after[0] || {},
  };
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

/**
 * lw 点赞或者点差
 * @param name 1：good 好 0：bad 差
 * @param id 博客编号
 */
router.post('/do', async (ctx, next) => {
  let dat = ctx.request.body;
  let name = dat.name ? 'good' : 'bad';
  let res = await db.op(`update bstu_blog set ${name}=${name} + 1 where id = ${dat.id}`);
  if (res.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

module.exports = router;
