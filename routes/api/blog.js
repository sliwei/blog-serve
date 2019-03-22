const router = require('koa-router')();
const {createToken, checkToken} = require('../tool/token');
const {checkCode} = require('../tool/verification');
const db = require('../database');
const {CustomError, HttpError} = require('../tool/error');
const {randomString} = require('../tool');
const os = require('os');

router.prefix('/yun/blog');

// sequelize:orm
// mysql2

/*------------------------博客------------------------*/

/**
 * lw 博客列表(前端)
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
 * lw 博客搜索(前端)
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
 * lw 博客列表(后端)
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

/*------------------------博客------------------------*/

/*------------------------评论、留言------------------------*/

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

/*------------------------评论、留言------------------------*/

/*------------------------安全------------------------*/

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

/*------------------------安全------------------------*/

/*------------------------用户------------------------*/

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

/*------------------------用户------------------------*/

/*------------------------服务器信息------------------------*/

/**
 * lw 获取服务器信息
 * @param {Number|String} freemem 服务器可用内存数
 * @param {Array} cpu {model:cpu内核模型，speed：cpu频率，times：其他}
 * @param {String} hostname 服务器主机名
 * @param {String} platform Node.js编译时的操作系统平台
 * @param {String} release 服务器发行版本
 * @param {Number|String} totalmem 系统内存总数
 * @param {String} type 操作系统
 * @param {String} constants 运行状态 0正常 1不正常
 */
router.get('/sys', async (ctx, next) => {

  let {parseInt} = Number;
  let {freemem, cpus, hostname, platform, release, totalmem, type, constants} = os;
  let total = parseInt(totalmem() / 1024 / 1024);
  let num = parseInt(freemem() / 1024 / 1024);
  let percentage = parseInt((num / total) * 100);

  ctx.DATA.data = {
    hostname: hostname(),
    platform: platform(),
    release: release(),
    percentage,
    type: type(),
    totalmem: `${total}MB`,
    freemem: `${num}MB`,
    constants: constants.SIGTRAP ? '1' : '0',
    cpu: cpus(),
  };
  ctx.body = ctx.DATA;
});

/*------------------------服务器信息------------------------*/

/*------------------------配置------------------------*/

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

/*------------------------配置------------------------*/

/*------------------------chat------------------------*/

/**
 * lw 单人聊天记录
 */
router.get('/room_chat', checkToken, async (ctx, next) => {
  let rommName = ctx.query.rommName;
  let backRommName = `${rommName.split('+')[1]}+${rommName.split('+')[0]}`;
  let room = await db.op(`select id from bstu_room where name = '${rommName}' or name = '${backRommName}'`);
  let message = [];
  if (room.length) {
    message = await db.op(`select m.cont as text, m.create_time, m.type, u.user, u.head_img from bstu_room_message m left join bstu_user u on m.u_id = u.id where r_id = ${room[0].id} order by m.create_time`);
  }
  ctx.DATA.data = message;
  ctx.body = ctx.DATA;
});

/**
 * lw 聊天列表
 */
router.get('/chat_list', checkToken, async (ctx, next) => {
  let user = ctx.res.USER;
  let chat = await db.op(
    `
    SELECT
      id,
      name, 
      user,
      head_img
    FROM
      bstu_user 
    WHERE
      id IN (
    SELECT DISTINCT(u_id) 
    FROM
      bstu_room_message 
    WHERE
      r_id IN ( SELECT DISTINCT(r_id) FROM bstu_room_message WHERE u_id = ${user.id} ) 
      AND u_id <> ${user.id} 
      )
    `
  );
  ctx.DATA.data = chat;
  ctx.body = ctx.DATA;
});


/**
 * lw 测试
 */
router.get('/test', async (ctx, next) => {
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

  console.log(code);
  let dat = await db.op(`select id from bstu_blog`);
  console.log('DAT', dat.length);
  ctx.DATA.data = {
    num: num,
    code: code,
    dat: dat
  };
  ctx.body = ctx.DATA;
});

/*------------------------chat------------------------*/


module.exports = router;
