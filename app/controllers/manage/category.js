const {BstuCategory, BstuBlog} = require("../../models");

/**
 * lw 分类列表
 */
const category_list = async (ctx, next) => {
  let category = await BstuCategory.findAll({
    where: {is_del: 0},
    order: [
      ['id', 'DESC']
    ],
  });
  ctx.DATA.data = category;
  ctx.body = ctx.DATA;
};

/**
 * lw 添加、修改、删除分类
 * @param id 编号
 * @param name 名称
 * @param sta 删除1:删除 0:正常
 */
const operation_category = async (ctx, next) => {
  let dat = ctx.request.body;
  let res;
  if (!dat.id) {
    // 新增
    let newDat = {
      name: dat.name
    };
    res = await BstuCategory.create(newDat);
  } else {
    let have = false;
    if (dat.sta && dat.sta === 1) {
      let count = await BstuBlog.count({
        where: {category_id: dat.id}
      });
      count && (have = true);
    }
    if (have) {
      ctx.DATA.code = 0;
      ctx.DATA.message = '不能删除已被使用的分类';
    } else {
      // 修改、删除
      let upDat = {
        name: dat.name,
        is_del: dat.sta,
      };
      !dat.name && delete dat.name;
      !(dat.sta >= 0) && delete dat.is_del;
      res = await BstuCategory.update(
        upDat, {where: {id: dat.id}}
      )
    }
  }
  if (!res || !(res || res[0])) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

module.exports = {
  category_list,
  operation_category,
};
