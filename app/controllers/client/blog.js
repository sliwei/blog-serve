const {VBstuBlog, Sequelize, BstuBlog, BstuUser, BstuCategory, VBstuBlogTag} = require("../../models");
const Op = Sequelize.Op;

/**
 * lw 博客列表
 * @param pageIndex 页码
 * @param pageSize 每页数
 */
const list = async (ctx, next) => {
  let pageIndex = ctx.query.pageIndex || '1';
  let pageSize = ctx.query.pageSize || '10';
  pageIndex = parseInt(pageIndex);
  pageSize = parseInt(pageSize);
  let offset = (pageIndex * pageSize) - pageSize;

  let res = await VBstuBlog.findAndCountAll({
    where: {is_draft: 0, is_del: 0},
    order: [
      ['id', 'DESC']
    ],
    offset: offset,
    limit: pageSize
  });

  ctx.DATA.data = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    pageCount: Math.ceil(res.count / pageSize),
    total: res.count,
    list: res.rows
  };
  ctx.body = ctx.DATA;
};

/**
 * lw 博客搜索
 * @param pageIndex 页码
 * @param pageSize 每页数
 * @param keyword 关键字
 */
const search = async (ctx, next) => {
  let pageIndex = ctx.query.pageIndex || '1';
  let pageSize = ctx.query.pageSize || '10';
  let keyword = ctx.query.keyword;
  keyword = keyword ? decodeURIComponent(keyword) : '';
  pageIndex = parseInt(pageIndex);
  pageSize = parseInt(pageSize);

  let offset = (pageIndex * pageSize) - pageSize;
  let where = {
    is_draft: 0,
    is_del: 0,
    [Op.or]: [
      {title: {[Op.like]: `%${keyword}%`}},
      {markdown: {[Op.like]: `%${keyword}%`}},
      {content: {[Op.like]: `%${keyword}%`}},
    ]
  };
  !keyword && delete where[Op.or];
  let res = await VBstuBlog.findAndCountAll({
    where: where,
    order: [
      ['id', 'DESC']
    ],
    offset: offset,
    limit: pageSize
  });

  ctx.DATA.data = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    pageCount: Math.ceil(res.count / pageSize),
    total: res.count,
    list: res.rows
  };
  ctx.body = ctx.DATA;
};

/**
 * lw 当前博客的邻居(上一个和下一个的文章、前端)
 * @param id 博客编号
 */
const neighbor = async (ctx, next) => {
  let id = ctx.query.id;
  id = parseInt(id);

  let after = await BstuBlog.findAll({
    include: [{
      model: BstuUser,
      as: 'user',
      attributes: ['name']
    }],
    where: {
      is_draft: 0,
      is_del: 0,
      id: {
        [Op.lt]: id,
      },
    },
    order: [
      ['id', 'DESC']
    ],
    attributes: ['id', 'code', 'title'],
    offset: 0,
    limit: 1,
  });

  let front = await BstuBlog.findAll({
    include: [{
      model: BstuUser,
      as: 'user',
      attributes: ['name']
    }],
    where: {
      is_draft: 0,
      is_del: 0,
      id: {
        [Op.gt]: id,
      },
    },
    order: [
      ['id']
    ],
    attributes: ['id', 'code', 'title'],
    offset: 0,
    limit: 1,
  });

  ctx.DATA.data = {
    after: after[0] || {},
    front: front[0] || {},
  };
  ctx.body = ctx.DATA;
};

/**
 * lw 博客详情
 * @param id 博客编号
 */
const clientDetail = async (ctx, next) => {
  let id = ctx.query.id || 0;
  let code = ctx.query.code || '';
  ctx.DATA.data = await BstuBlog.findOne({
    include: [
      {model: BstuUser, as: 'user', attributes: ['name', 'head_img', 'website', 'good', 'bad', 'newly_login']},
      {model: BstuCategory, as: 'category', attributes: ['name']},
      {model: VBstuBlogTag, as: 'tag_list', attributes: ['name', ['t_id', 'id']]},
    ],
    where: {
      [Op.or]: {
        code: code,
        id: id,
      }
    }
  });
  ctx.body = ctx.DATA;
};

/**
 * lw 点赞或者点差
 * @param name 1：good 好 0：bad 差
 * @param id 博客编号
 */
const does = async (ctx, next) => {
  let dat = ctx.request.body;
  let name = dat.name ? 'good' : 'bad';
  let res = await BstuBlog.increment(
    [[name]], {by: 1, where: {id: dat.id}}
  );
  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

module.exports = {
  list,
  search,
  neighbor,
  clientDetail,
  does,
};
