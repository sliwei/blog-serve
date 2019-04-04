const {HttpError} = require('../../utils/tool/error');
const {randomString} = require('../../utils/tool');
const {VBstuBlog, Sequelize, BstuBlog, VBstuBlogTag, BstuBlogTag} = require("../../models");
const Op = Sequelize.Op;

/**
 * lw 博客列表
 * @param pageIndex 页码
 * @param pageSize 每页数量
 * @param keyword 关键字
 * @param category_id 分类
 */
const server_list = async (ctx, next) => {
  let user = ctx.res.USER;
  let pageIndex = ctx.query.pageIndex || '1';
  let pageSize = ctx.query.pageSize || '10';
  let keyword = ctx.query.keyword;
  let category_id = ctx.query.category_id;

  pageIndex = parseInt(pageIndex);
  pageSize = parseInt(pageSize);
  category_id = category_id ? parseInt(category_id) : '';
  let offset = (pageIndex * pageSize) - pageSize;
  pageSize = parseInt(pageSize);

  let where = {
    u_id: user.id,
    is_del: 0,
    category_id: category_id,
    [Op.or]: [
      {title: {[Op.like]: `%${keyword}%`}},
      {markdown: {[Op.like]: `%${keyword}%`}},
      {content: {[Op.like]: `%${keyword}%`}},
    ]
  };
  !category_id && delete where.category_id;
  !keyword && delete where[Op.or];
  let dat = await VBstuBlog.findAndCountAll({
    where: where,
    attributes: ['id', 'title', 'code', 'img', 'time', 'create_time', 'is_draft', 'is_evaluate', 'category_name', 'user_name'],
    order: [
      ['id', 'DESC'],
    ],
    offset: offset,
    limit: pageSize,
  });
  ctx.DATA.data = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    pageCount: Math.ceil(dat.count / pageSize),
    total: dat.count,
    list: dat.rows
  };
  ctx.body = ctx.DATA;
};

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
const edit = async (ctx, next) => {
  let user = ctx.res.USER;
  let dat = ctx.request.body;
  let edit = false, canEdit = false;
  if (dat.id) {
    edit = true;
    let blog = await BstuBlog.findOne({
      where: {id: dat.id}
    });
    if (blog && blog.u_id === user.id) {
      canEdit = true;
    }
  }
  let res;
  if (edit) {
    if (canEdit) {

      let upDat = {
        title: dat.title,
        content: dat.content,
        markdown: dat.markdown,
        is_draft: dat.is_draft,
        img: dat.img,
        time: dat.time,
        is_evaluate: dat.is_evaluate,
      };

      !dat.title && delete upDat.title;
      !dat.content && delete upDat.content;
      !dat.markdown && delete upDat.markdown;
      !dat.img && delete upDat.img;
      !dat.time && delete upDat.time;
      !(dat.is_draft >= 0) && delete upDat.is_draft;
      !(dat.is_evaluate >= 0) && delete upDat.is_evaluate;

      try {
        await BstuBlog.update(
          upDat, {where: {id: dat.id}}
        );
        await BstuBlogTag.destroy({
          where: {b_id: dat.id}
        });
        let newDat = [];
        dat.tag_id.map(id => {
          newDat.push({t_id: id, b_id: dat.id})
        });
        await BstuBlogTag.bulkCreate(newDat)
        res = true
      } catch (e) {
        res = false
      }
      // res [ 1 ]
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
      let have = await BstuBlog.findOne({
        where: {code: code}
      });
      if (have) {
        if (num > 20) {
          throw new HttpError(500);
        }
        await check();
      }
    };
    await check();

    let tag = [];
    dat.tag_id.map(id => {
      tag.push({t_id: id})
    });
    let newDat = {
      u_id: user.id,
      title: dat.title,
      content: dat.content,
      markdown: dat.markdown,
      time: new Date(dat.time),
      category_id: 9,
      is_draft: dat.is_draft || 0,
      img: dat.img,
      is_evaluate: dat.is_evaluate || 0,
      code: code,
      blog_tag: tag
    };
    res = await BstuBlog.create(newDat, {include: [{model: BstuBlogTag, as: 'blog_tag'}]});
    // res {xxx-xxx}
  }

  console.log(res);

  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.json(ctx.DATA);
};

/**
 * lw 博客删除、恢复、草稿、发布
 * @param id 博客编号
 * @param sta 博客状态 1删除 0正常
 * @param draft 博客草稿状态 1草稿 0发布
 */
const blog_status = async (ctx, next) => {
  let dat = ctx.request.body;
  let upDat = {
    is_del: dat.sta,
    is_draft: dat.draft,
  };
  !(dat.sta >= 0) && delete upDat.is_del;
  !(dat.draft >= 0) && delete upDat.is_draft;
  let res = await BstuBlog.update(
    upDat, {where: {id: dat.id}}
  );
  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

/**
 * lw 博客详情
 * @param id 博客编号
 */
const detail = async (ctx, next) => {
  let id = ctx.query.id || 0;
  let code = ctx.query.code || '';
  ctx.DATA.data = await BstuBlog.findOne({
    include: [
      {model: VBstuBlogTag, as: 'tag_list', attributes: ['name', ['t_id', 'id']]},
    ],
    where: {
      [Op.or]: [
        {code: code},
        {id: id},
      ]
    },
  });
  ctx.body = ctx.DATA;
};

module.exports = {
  server_list,
  edit,
  blog_status,
  detail,
};
