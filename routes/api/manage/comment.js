const router = require('koa-router')();
const {createToken, checkToken} = require('../../tool/token');
const {checkCode} = require('../../tool/verification');
const db = require('../../database');
const {CustomError, HttpError} = require('../../tool/error');

router.prefix('/blog/manage/comment');

/**
 * lw 评论、留言
 * @param name 昵称
 * @param website 站点
 * @param mail 邮箱
 * @param b_id 博客编号
 * @param f_id 回复者编号
 * @param cont 内容
 */
router.post('/evaluate', async (ctx, next) => {
  let dat = ctx.request.body;
  dat = ctx.toEscapeObject(dat);
  let hava, u_id;
  if (dat.website && dat.mail) {
    hava = await db.op(`select id from bstu_user where website = ${dat.website} and mail = ${dat.mail}`);
    if (hava.length < 1) {
      let newUser = await db.op(`insert into bstu_user(name,website,mail) values(${dat.name || null},${dat.website},${dat.mail})`);
      u_id = newUser.insertId;
    } else {
      u_id = hava[0].id;
    }
  }
  let res = await db.op(`insert into bstu_comment(u_id,b_id,f_id,cont) values(${u_id || null},${dat.b_id},${dat.f_id || null},${dat.cont})`);
  if (res.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

/**
 * lw 评论、留言列表
 * @param pageIndex 页码
 * @param pageSize 每页输
 */
router.get('/comment_list', checkToken, async (ctx, next) => {
  let user = ctx.res.USER;
  console.log(user);
  let pageIndex = ctx.query.pageIndex;
  let pageSize = ctx.query.pageSize;
  pageIndex = parseInt(pageIndex);
  pageSize = parseInt(pageSize);
  let count_sql = await db.op(
    `
    SELECT
      count(c.id) as total 
    FROM
      (
    SELECT
      c.*,
      u.NAME AS c_name 
    FROM
      (
    SELECT
      c.id,
      c.cont,
      c.b_id,
      c.f_id,
      c.u_id,
      c.type,
      c.create_time,
      b.title 
    FROM
      bstu_blog b,
      bstu_comment c 
    WHERE
      c.is_del = 0 
      AND b.u_id = ${user.id} 
      AND b.id = c.b_id 
      ) c
      LEFT JOIN bstu_user u ON c.u_id = u.id 
      ) c
      LEFT JOIN bstu_user u ON c.f_id = u.id
    `);
  let total = count_sql[0].total;
  console.log(count_sql);
  let red = (pageIndex * pageSize) - pageSize;
  let rows = await db.op(
    `
    SELECT
      c.*,
      u.NAME AS f_name 
    FROM
      (
    SELECT
      c.*,
      u.NAME AS c_name 
    FROM
      (
    SELECT
      c.id,
      c.cont,
      c.b_id,
      c.f_id,
      c.u_id,
      c.type,
      c.is_pass,
      c.create_time,
      b.code,
      b.title as blog_title 
    FROM
      bstu_blog b,
      bstu_comment c 
    WHERE
      c.is_del = 0 
      AND b.u_id = ${user.id} 
      AND b.id = c.b_id 
      ) c
      LEFT JOIN bstu_user u ON c.u_id = u.id 
      ) c
      LEFT JOIN bstu_user u ON c.f_id = u.id 
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
 * lw 评论列表
 * @param b_id 博客编号
 */
router.get('/evaluate_list', async (ctx, next) => {
  let code = ctx.query.code;
  let rows = await db.op(
    `
    SELECT
      c.*,
      u.name AS f_name,
      u.head_img AS f_head_img 
    FROM
      (
    SELECT
      c.*,
      u.name AS u_name,
      u.head_img AS u_head_img 
    FROM
      (
    SELECT
      b.id,
      b.u_id,
      b.f_id,
      b.cont,
      b.create_time,
      u.u_id AS f_u_id 
    FROM
      v_bstu_comment b
      LEFT JOIN v_bstu_comment u ON b.f_id = u.id 
    WHERE
      b.is_pass = 1 
      AND b.is_del = 0 
      AND b.type = 0 
      AND b.code = '${code}' 
      ) c
      LEFT JOIN bstu_user u ON c.u_id = u.id 
      ) c
      LEFT JOIN bstu_user u ON c.f_u_id = u.id
    `
  );
  ctx.DATA.data = rows;
  ctx.body = ctx.DATA;
});

/**
 * lw 评论审核通过
 * @param id 评论编号
 * @param sta 是否通过审核 0:待审核 1:通过 2:未通过
 */
router.post('/evaluate_examine', checkToken, async (ctx, next) => {
  let dat = ctx.request.body;
  let res = await db.op(`update bstu_comment set is_pass = ${dat.sta} where id = ${dat.id}`);
  if (res.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

/**
 * lw 评论删除
 * @param id 评论编号
 * @param sta 是否删除 0:正常 1:删除
 */
router.post('/evaluate_del', checkToken, async (ctx, next) => {
  let dat = ctx.request.body;
  let res = await db.op(`update bstu_comment set is_del = ${dat.sta} where id = ${dat.id}`);
  if (res.affectedRows < 1) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
});

module.exports = router;
