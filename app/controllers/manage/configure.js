const {BstuConfigure} = require("../../models");

/**
 * lw 获取配置
 */
const get_configure = async (ctx, next) => {
  ctx.DATA.data = await BstuConfigure.findAll();
  ctx.body = ctx.DATA;
};

/**
 * lw 修改配置
 * @param c_key 配置项 author：作者
 * @param val 配置项值
 */
const set_configure = async (ctx, next) => {
  let dat = ctx.request.body;
  let res = await BstuConfigure.update(
    {val: dat.val},
    {where: {c_key: dat.c_key}}
  );
  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

module.exports = {
  get_configure,
  set_configure,
};
