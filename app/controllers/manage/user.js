const { BstuUser } = require('../../models')

/**
 * lw 修改资料
 * @param id 作者编号
 * @param name 昵称
 * @param rpassword 密码
 * @param mail 邮箱
 * @param website 站点
 * @param head_img 头像
 */
const edit_user = async (ctx, next) => {
  let dat = ctx.request.body
  let upDat = {
    name: dat.name,
    password: dat.rpassword,
    mail: dat.mail,
    website: dat.website,
    head_img: dat.head_img
  }
  !dat.name && delete upDat.name
  !dat.rpassword && delete upDat.password
  !dat.mail && delete upDat.mail
  !dat.website && delete upDat.website
  !dat.head_img && delete upDat.head_img
  let res = await BstuUser.update(upDat, { where: { id: dat.id } })
  if (ctx.state(res)) {
    ctx.DATA.code = 0
  }
  ctx.body = ctx.DATA
}

module.exports = {
  edit_user
}
