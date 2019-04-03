const { createToken } = require("../../utils/tool/token");
const { HttpError } = require("../../utils/tool/error");
const { BstuUser, sequelize } = require("../../models");

/**
 * lw 验证信息
 * @param Authorization token
 */
const info = async (ctx, next) => {
  let user = ctx.res.USER;
  let dat = await BstuUser.findOne({ where: { id: user.id } });
  if (dat) {
    ctx.DATA.data = {
      name: dat.name,
      mail: dat.mail,
      user: dat.user,
      website: dat.website,
      good: dat.good,
      bad: dat.bad,
      newly_login: dat.newly_login,
      head_img: dat.head_img
    };
  } else {
    throw new HttpError(500);
  }
  ctx.body = ctx.DATA;
};

/**
 * lw 登录
 * @param user 账号
 * @param password 密码
 * @param code 验证码
 */
const login = async (ctx, next) => {
  let dat = ctx.request.body;
  let data = await BstuUser.findOne({
    where: { user: dat.user, password: dat.password },
    attributes: ["id", "name", "user", "head_img"]
  });
  if (data) {
    BstuUser.update(
      { newly_login: sequelize.fn("now") },
      { where: { id: data.id } }
    );
    ctx.DATA.data = {
      token: createToken({ id: data.id }),
      user: data.user,
      name: data.name,
      head_img: data.head_img,
      id: data.id
    };
  } else {
    ctx.DATA.code = 0;
    ctx.DATA.message = "账户名或密码错误";
  }
  ctx.body = ctx.DATA;
};

/**
 * lw 注册
 * @param name 昵称
 * @param user 账号
 * @param rpassword 密码 MD5
 * @param code 验证码
 */
const register = async (ctx, next) => {
  let dat = ctx.request.body;
  let news = await BstuUser.create({
    name: dat.name,
    user: dat.user,
    password: dat.password
  });
  if (!news) {
    ctx.DATA.code = 0;
    ctx.DATA.message = "注册失败";
  }
  ctx.body = ctx.DATA;
};

module.exports = {
  info,
  login,
  register
};
