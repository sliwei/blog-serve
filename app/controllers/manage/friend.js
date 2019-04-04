const {BstuFriend} = require("../../models");

/**
 * lw 友链列表
 */
const friend_list = async (ctx, next) => {
  ctx.DATA.data = await BstuFriend.findAll({
    where: {is_del: 0},
    order: [
      ['id', 'DESC']
    ]
  });
  ctx.body = ctx.DATA;
};

/**
 * lw 添加、修改、删除友链
 * @param id 编号
 * @param title 站点名称
 * @param website 友链地址
 * @param sta 删除1:删除 0:正常
 */
const operation_friend = async (ctx, next) => {
  let dat = ctx.request.body;
  let res;
  if (!dat.id) {
    // 新增
    res = await BstuFriend.create({
      title: dat.title,
      website: dat.website,
    })
  } else {
    // 修改、删除
    let upDat = {
      title: dat.title,
      website: dat.website,
      is_del: dat.is_del,
    };
    !dat.title && delete upDat.title;
    !dat.website && delete upDat.website;
    !dat.is_del && delete upDat.is_del;
    res = await BstuFriend.update(
      upDat, {where: {id: dat.id}}
    )
  }
  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

module.exports = {
  friend_list,
  operation_friend,
};
