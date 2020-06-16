const {ExYype, VExView} = require("../../models");

/**
 * lw 类型
 */
const type = async (ctx, next) => {
  ctx.DATA.data = await ExYype.findAll();
  ctx.body = ctx.DATA;
};

/**
 * lw 数据
 */
const data = async (ctx, next) => {
  ctx.DATA.data = await VExView.findAll({
    order: [
      ['date']
    ],
  });
  ctx.body = ctx.DATA;
};

module.exports = {
  type,
  data
};
