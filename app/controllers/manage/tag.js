const { BstuTag, VBstuBlogTag } = require('../../models')

/**
 * lw 标签列表
 */
const tag_list = async (ctx, next) => {
  ctx.DATA.data = await BstuTag.findAll({
    where: { is_del: 0 },
    order: [['id', 'DESC']]
  })
  ctx.body = ctx.DATA
}

/**
 * lw 添加、修改、删除标签
 * @param id 编号
 * @param name 名称
 * @param sta 删除1:删除 0:正常
 */
const operation_tag = async (ctx, next) => {
  let dat = ctx.request.body
  let res
  if (!dat.id) {
    // 新增
    let newDat = {
      name: dat.name
    }
    res = await BstuTag.create(newDat)
  } else {
    let have = false
    if (dat.sta && dat.sta === 1) {
      let count = await VBstuBlogTag.count({
        where: { t_id: dat.id }
      })
      count && (have = true)
    }
    if (have) {
      ctx.DATA.code = 0
      ctx.DATA.message = '不能删除已被使用的标签'
    } else {
      // 修改、删除
      let upDat = {
        name: dat.name,
        is_del: dat.sta
      }
      !dat.name && delete dat.name
      !(dat.sta >= 0) && delete dat.is_del
      res = await BstuTag.update(upDat, { where: { id: dat.id } })
    }
  }
  if (ctx.state(res)) {
    ctx.DATA.code = 0
  }
  ctx.body = ctx.DATA
}

module.exports = {
  tag_list,
  operation_tag
}
