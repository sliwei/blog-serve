const {VBstuBlog, Sequelize, sequelize, BstuBlog, BstuUser, BstuCategory, BstuTag, VBstuBlogTag, BstuFriend} = require("../../models");
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
    attributes: ['title', 'img', 'code', 'create_time', 'id'],
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
  let type = ctx.query.type || '';
  let where = {
    [Op.or]: {
      code: code,
      id: id,
    },
    is_draft: 0,
    is_del: 0,
  };
  if (type) {
    delete where.is_draft;
  }
  ctx.DATA.data = await BstuBlog.findOne({
    include: [
      {model: BstuUser, as: 'user', attributes: ['name', 'head_img', 'website', 'good', 'bad', 'newly_login']},
      {model: BstuCategory, as: 'category', attributes: ['name']},
      {model: VBstuBlogTag, as: 'tag_list', attributes: ['name', ['t_id', 'id']]},
    ],
    where: where
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

/**
 * lw 最新5篇文章
 */
const recent = async (ctx, next) => {
  let pageIndex = 1;
  let pageSize = 5;
  let offset = (pageIndex * pageSize) - pageSize;

  let list = await VBstuBlog.findAll({
    where: {is_draft: 0, is_del: 0},
    attributes: ['title', 'img', 'create_time', 'code'],
    order: [
      ['id', 'DESC']
    ],
    offset: offset,
    limit: pageSize
  });

  ctx.DATA.data = list;
  ctx.body = ctx.DATA;
};

/**
 * lw 友链列表
 */
const friend_list = async (ctx, next) => {
  ctx.DATA.data = await BstuFriend.findAll({
    where: {is_del: 0},
    attributes: ['title', 'website'],
    order: [
      ['id', 'DESC']
    ]
  });
  ctx.body = ctx.DATA;
};

/**
 * lw 获取基础信息
 */
const num = async (ctx, next) => {
  // ctx.DATA.data = await BstuFriend.findAll({
  //   where: {is_del: 0},
  //   attributes: ['title', 'website'],
  //   order: [
  //     ['id', 'DESC']
  //   ]
  // });
  // const blog = await BstuBlog.count({where: {is_del: 0, is_draft: 0}});
  // const category = await BstuCategory.count({where: {is_del: 0}});
  // const tags = await BstuTag.count({where: {is_del: 0}});
  let blog = 0;
  let category = 0;
  let tags = 0;
  blog = await BstuBlog.count({where: {is_del: 0, is_draft: 0}});
  category = await BstuCategory.count({where: {is_del: 0}});
  tags = await BstuTag.count({where: {is_del: 0}});
  ctx.DATA.data = {
    blog: blog,
    category: category,
    tags: tags,
  };
  ctx.body = ctx.DATA;
};

/**
 * lw 标签列表
 */
const tag_list = async (ctx, next) => {
  let haveTags = await VBstuBlogTag.findAll({
    attributes: [[sequelize.fn('COUNT', sequelize.col('t_id')), 'num'], ['t_id', 'id']],
    group: 't_id',
    raw: true
  });
  let list = await BstuTag.findAll({
    where: {is_del: 0},
    order: [
      ['id', 'DESC']
    ]
  });
  list = JSON.parse(JSON.stringify(list));
  list.map(item => {
    item.num = 0;
    haveTags.map(haveItem => {
      if (item.id === haveItem.id) {
        item.num = haveItem.num;
      }
    });
  });
  ctx.DATA.data = list;
  ctx.body = ctx.DATA;
};

/**
 * lw 归档，查询所有博客的名称/时间/URL/分类
 */
const archives = async (ctx, next) => {
  let res = await VBstuBlog.findAndCountAll({
    where: {is_draft: 0, is_del: 0},
    attributes: ['title', 'code', 'create_time', 'id'],
    order: [
      ['create_time', 'DESC']
    ],
  });

  ctx.DATA.data = res.rows;
  ctx.body = ctx.DATA;
};
console.log('A2A')

module.exports = {
  list,
  search,
  neighbor,
  clientDetail,
  does,
  recent,
  blogFriendList: friend_list,
  num,
  tags: tag_list,
  archives,
};
