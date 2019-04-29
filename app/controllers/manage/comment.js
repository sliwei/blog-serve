const {BstuComment, BstuUser, BstuBlog, Sequelize} = require("../../models");
const Op = Sequelize.Op;
var wc = require('sensitive-word-filter');

/**
 * lw 评论、留言
 * @param name 昵称
 * @param website 站点
 * @param mail 邮箱
 * @param b_id 博客编号
 * @param f_id 回复者编号
 * @param cont 内容
 */
const evaluate = async (ctx, next) => {
  let dat = ctx.request.body;
  let hava, u_id;
  if (dat.name || dat.website || dat.mail) {
    if (dat.website || dat.mail) {
      hava = await BstuUser.findOne({
        where: {
          website: dat.website,
          mail: dat.mail,
        }
      });
    }
    if (!hava) {
      let newDat = {
        name: dat.name,
        website: dat.website,
        mail: dat.mail,
      };
      !dat.name && delete newDat.name;
      let newUser = await BstuUser.create(newDat);
      u_id = newUser.id;
    } else {
      u_id = hava.id;
    }
  }
  let newDat = {
    u_id: u_id,
    b_id: dat.b_id,
    f_id: dat.f_id,
    is_pass: 1,
    cont: wc.filter(dat.cont),
    type: wc.filter(dat.type),
  };
  !u_id && delete newDat.u_id;
  !dat.f_id && delete newDat.f_id;
  let res = await BstuComment.create(newDat);
  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

/**
 * lw 评论、留言列表
 * @param pageIndex 页码
 * @param pageSize 每页输
 */
const comment_list = async (ctx, next) => {
  let user = ctx.res.USER;
  let pageIndex = ctx.query.pageIndex || '1';
  let pageSize = ctx.query.pageSize || '10';
  pageIndex = parseInt(pageIndex);
  pageSize = parseInt(pageSize);
  let offset = (pageIndex * pageSize) - pageSize;

  let bIds = await BstuBlog.findAll({where: {u_id: user.id}, attributes: ['id']});
  let ids = [];
  bIds.map(item => {
    ids.push(item.id)
  });

  let res = await BstuComment.findAndCountAll({
    include: [
      {model: BstuBlog, as: 'blog', attributes: ['title', 'code']},
      {model: BstuUser, as: 'c_user', attributes: ['name']},
      {
        model: BstuComment, as: 'comment', attributes: ['u_id', 'create_time'],
        include: [
          {model: BstuUser, as: 'c_user', attributes: ['name', 'head_img']},
        ]
      },
    ],
    where: {
      is_del: 0,
      [Op.or]: [
        {b_id: {[Op.in]: ids}},
        {u_id: user.id},
      ]
    },
    order: [
      ['id', 'DESC'],
    ],
    offset: offset,
    limit: pageSize,
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
 * lw 博客评论列表
 * @param b_id 博客编号
 */
const evaluate_list = async (ctx, next) => {
  let code = ctx.query.code;
  console.log(code);
  try {
    if (code) {
      let blog = await BstuBlog.findOne({where: {code: code}});
      ctx.DATA.data = await BstuComment.findAll({
        include: [
          {model: BstuUser, as: 'c_user', attributes: ['id', 'name', 'head_img']},
          {
            model: BstuComment, as: 'comment', attributes: ['u_id', 'create_time'],
            include: [
              {model: BstuUser, as: 'c_user', attributes: ['name', 'head_img']},
            ]
          },
        ],
        where: {
          is_del: 0,
          is_pass: 1,
          b_id: blog.id
        },
        order: [
          ['id', 'DESC'],
        ],
      });
    } else {
      ctx.DATA.data = await BstuComment.findAll({
        include: [
          {model: BstuUser, as: 'c_user', attributes: ['id', 'name', 'head_img']},
          {
            model: BstuComment, as: 'comment', attributes: ['u_id', 'create_time'],
            include: [
              {model: BstuUser, as: 'c_user', attributes: ['name', 'head_img']},
            ]
          },
        ],
        where: {
          is_del: 0,
          is_pass: 1,
          type: 1
        },
        order: [
          ['id', 'DESC'],
        ],
      });
    }

  } catch (e) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

/**
 * lw 评论审核通过
 * @param id 评论编号
 * @param sta 是否通过审核 0:待审核 1:通过 2:未通过
 */
const evaluate_examine = async (ctx, next) => {
  let dat = ctx.request.body;
  let res = await BstuComment.update(
    {is_pass: dat.sta},
    {where: {id: dat.id}}
  );
  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

/**
 * lw 评论删除
 * @param id 评论编号
 * @param sta 是否删除 0:正常 1:删除
 */
const evaluate_del = async (ctx, next) => {
  let dat = ctx.request.body;
  let res = await BstuComment.update(
    {is_del: dat.sta},
    {where: {id: dat.id}}
  );
  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

module.exports = {
  evaluate,
  comment_list,
  evaluate_list,
  evaluate_examine,
  evaluate_del,
};
